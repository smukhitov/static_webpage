// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Jumps to an anchor and asserts the target section lands clear of the sticky
 * nav. `--nav-height` is a transcription of a measured layout and has gone
 * stale before, so this checks the outcome rather than the number.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} link  selector for the anchor link to follow
 * @param {string} id    the section it targets, without the '#'
 */
export async function expectClearOfStickyNav(page, link, id) {
  // Anchor jumps animate, and the web fonts reflow the page under a scroll
  // position already chosen. Settle both before jumping.
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(link).click();

  const gap = await page.evaluate((selector) => {
    const nav = document.querySelector('.site-nav');
    if (getComputedStyle(nav).position !== 'sticky') return null;
    const section = document.querySelector(selector).getBoundingClientRect();
    return section.top - nav.getBoundingClientRect().bottom;
  }, `#${id}`);

  expect(gap, 'the nav is not sticky here, so the check proves nothing').not.toBeNull();
  expect(gap, `#${id} sits under the sticky nav`).toBeGreaterThanOrEqual(0);
}

/**
 * The checks every chapter page has to pass. Both parts share one layout, one
 * stylesheet pair and one set of accessibility requirements, so the common
 * expectations live here and each spec supplies only what differs.
 *
 * Related assertions are grouped into one test per concern rather than one per
 * assertion: each test costs a page load, and a failure reads better as "the
 * outline is wrong" than as four separate red lines saying the same thing.
 *
 * @param {object} spec
 * @param {string} spec.path        URL of the page, e.g. '/fundamentals.html'
 * @param {string} spec.title       exact <title>
 * @param {string[]} spec.headings  section headings, in document order
 * @param {number} spec.diagrams    how many labelled SVG diagrams it carries
 * @param {string} spec.stylesheet  the page-specific stylesheet
 */
export function describeArticlePage({ path, title, headings, diagrams, stylesheet }) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('renders the outline the contents promises', async ({ page }) => {
      await expect(page).toHaveTitle(title);
      expect(await page.locator('main section h2').allTextContents()).toEqual(headings);

      const hrefs = await page
        .locator('.toc a')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
      expect(hrefs.length).toBe(headings.length);
      for (const href of hrefs) {
        await expect(page.locator(`#${href.replace('#', '')}`)).toHaveCount(1);
      }
    });

    test('wires the site chrome to pages that exist', async ({ page }) => {
      // The shared design system has to load before the page's own sheet: the
      // landing page's copy of these tokens now lives in src/index.css, so this
      // is what still guards the layering until the article pages are ported.
      const sheets = await page
        .locator('link[rel=stylesheet]')
        .evaluateAll((links) => links.map((l) => l.getAttribute('href')));
      expect(sheets).toEqual(['tokens.css', 'design-system.css', stylesheet]);

      const current = page.locator('.site-nav [aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute('href', path.replace('/', ''));

      const pager = page.locator('.pager .pager-link');
      await expect(pager).toHaveCount(2);
      const links = await pager.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      for (const href of links) {
        const response = await page.request.get(href.split('#')[0]);
        expect(response.ok(), `${href} is a dead link`).toBe(true);
      }

      const first = await page.locator('.toc a').first().getAttribute('href');
      await expectClearOfStickyNav(page, '.toc a >> nth=0', first.slice(1));

      await page.locator('.nav-brand a').click();
      await expect(page).toHaveURL(/\/index\.html$/);
      await expect(page.locator('#chapters')).toHaveCount(1);
    });

    test('illustrates and summarises every section', async ({ page }) => {
      const sections = page.locator('main section');
      await expect(sections.locator('.callout')).toHaveCount(headings.length);

      const illustrated = await sections.evaluateAll((found) =>
        found.map((s) => Boolean(s.querySelector('figure, table')))
      );
      expect(illustrated).toEqual(headings.map(() => true));

      const svgs = page.locator('svg.diagram');
      await expect(svgs).toHaveCount(diagrams);
      for (let i = 0; i < diagrams; i++) {
        const labelledby = await svgs.nth(i).getAttribute('aria-labelledby');
        expect(labelledby, `diagram ${i} is missing aria-labelledby`).toBeTruthy();
        const label = await page.locator(`#${labelledby}`).textContent();
        expect(label?.trim().length, `diagram ${i} has an empty title`).toBeGreaterThan(0);
      }
    });

    // The wide diagrams are 640px and do not shrink; they scroll inside their own
    // wrapper instead. The page itself must never scroll sideways.
    test('fits a phone screen without the page scrolling sideways', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);

      const { doc, win } = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
      }));
      expect(doc).toBeLessThanOrEqual(win);

      const wrapper = page.locator('.figure-scroll').first();
      if (await wrapper.count()) {
        const box = await wrapper.boundingBox();
        expect(box.width).toBeLessThanOrEqual(win);
        const inner = await wrapper.evaluate((el) => el.scrollWidth);
        expect(inner, 'the diagram should stay full size and scroll').toBeGreaterThan(box.width);
      }
    });

    test('has no detectable WCAG 2 A/AA accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}
