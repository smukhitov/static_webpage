// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * The checks every chapter page has to pass. Both parts share one layout, one
 * stylesheet pair and one set of accessibility requirements, so the common
 * expectations live here and each spec supplies only what differs.
 *
 * @param {object} spec
 * @param {string} spec.path        URL of the page, e.g. '/fundamentals.html'
 * @param {string} spec.title       exact <title>
 * @param {string[]} spec.headings  section headings, in document order
 * @param {number} spec.diagrams    how many labelled SVG diagrams it carries
 * @param {string} spec.stylesheet  the page-specific stylesheet
 */
export function describeArticlePage({ path, title, headings, diagrams, stylesheet }) {
  test.beforeEach(async ({ page }) => {
    await page.goto(path);
  });

  test('has the expected page title', async ({ page }) => {
    await expect(page).toHaveTitle(title);
  });

  test('renders every section heading in order', async ({ page }) => {
    const found = await page.locator('main section h2').allTextContents();
    expect(found).toEqual(headings);
  });

  test('contents links resolve to existing section ids', async ({ page }) => {
    const hrefs = await page.locator('.toc a').evaluateAll((links) =>
      links.map((a) => a.getAttribute('href'))
    );
    expect(hrefs.length).toBe(headings.length);
    for (const href of hrefs) {
      const id = href.replace('#', '');
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('marks itself as the current page in the nav', async ({ page }) => {
    const current = page.locator('.site-nav [aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', path.replace('/', ''));
  });

  test('the site nav leads back to the landing page', async ({ page }) => {
    await page.locator('.nav-brand a').click();
    await expect(page).toHaveURL(/\/index\.html$/);
    await expect(page.locator('#chapters')).toHaveCount(1);
  });

  test('every diagram carries a non-empty accessible name', async ({ page }) => {
    const svgs = page.locator('svg.diagram');
    await expect(svgs).toHaveCount(diagrams);

    for (let i = 0; i < diagrams; i++) {
      const labelledby = await svgs.nth(i).getAttribute('aria-labelledby');
      expect(labelledby, `diagram ${i} is missing aria-labelledby`).toBeTruthy();
      const label = await page.locator(`#${labelledby}`).textContent();
      expect(label?.trim().length, `diagram ${i} has an empty title`).toBeGreaterThan(0);
    }
  });

  test('every section illustrates itself with a figure or a table', async ({ page }) => {
    const illustrated = await page.locator('main section').evaluateAll((sections) =>
      sections.map((s) => Boolean(s.querySelector('figure, table')))
    );
    expect(illustrated).toEqual(headings.map(() => true));
  });

  test('opens each section with a key idea', async ({ page }) => {
    await expect(page.locator('main section .callout')).toHaveCount(headings.length);
  });

  test('offers a pager to somewhere that exists', async ({ page }) => {
    const links = page.locator('.pager .pager-link');
    await expect(links).toHaveCount(2);

    const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    for (const href of hrefs) {
      const response = await page.request.get(href.split('#')[0]);
      expect(response.ok(), `${href} is a dead link`).toBe(true);
    }
  });

  // The landing page has moved to React and Tailwind, where the same Classical
  // tokens are declared in src/index.css. Until these two pages follow, they
  // keep loading design-system.css themselves — so what this can still check is
  // that the shared sheet comes first and the page's own sheet layers on top.
  test('layers its own stylesheet over the shared design system', async ({ page }) => {
    const sheets = await page.locator('link[rel=stylesheet]').evaluateAll((links) =>
      links.map((l) => l.getAttribute('href'))
    );
    expect(sheets).toEqual(['design-system.css', stylesheet]);
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
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}


