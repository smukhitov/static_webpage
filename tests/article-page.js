// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expectClearOfStickyNav } from './nav-clearance.js';

/**
 * The checks every chapter page has to pass; each spec supplies only what
 * differs. Assertions are grouped one test per concern rather than one per
 * assertion, because each test costs a page load.
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
      // Load order is load-bearing: tokens.css declares what the other two
      // consume, and article.css overrides design-system.css.
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

      await expectClearOfStickyNav(page, page.locator('.toc a').first());

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
