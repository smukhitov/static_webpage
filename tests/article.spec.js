// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const SECTION_HEADINGS = [
  'What Is Machine Learning?',
  'Supervised, Unsupervised, and Reinforcement Learning',
  'The Train/Test Split',
  'Overfitting',
  'Common Algorithms',
];

test.beforeEach(async ({ page }) => {
  await page.goto('/fundamentals.html');
});

test('has the expected page title', async ({ page }) => {
  await expect(page).toHaveTitle('Machine Learning Fundamentals — The Chapters');
});

test('renders all five section headings in order', async ({ page }) => {
  const headings = await page.locator('main section h2').allTextContents();
  expect(headings).toEqual(SECTION_HEADINGS);
});

test('contents links resolve to existing section ids', async ({ page }) => {
  const hrefs = await page.locator('.toc a').evaluateAll((links) =>
    links.map((a) => a.getAttribute('href'))
  );
  expect(hrefs.length).toBe(5);
  for (const href of hrefs) {
    const id = href.replace('#', '');
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('the site nav leads back to the landing page', async ({ page }) => {
  await page.locator('.nav-brand a').click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.locator('#chapters')).toHaveCount(1);
});

test('every section carries a diagram with a non-empty accessible name', async ({ page }) => {
  const diagrams = page.locator('svg.diagram');
  await expect(diagrams).toHaveCount(5);

  const count = await diagrams.count();
  for (let i = 0; i < count; i++) {
    const svg = diagrams.nth(i);
    const labelledby = await svg.getAttribute('aria-labelledby');
    expect(labelledby, `diagram ${i} is missing aria-labelledby`).toBeTruthy();
    const label = await page.locator(`#${labelledby}`).textContent();
    expect(label?.trim().length).toBeGreaterThan(0);
  }
});

test('shares the design system stylesheet with the landing page', async ({ page }) => {
  const sheets = await page.locator('link[rel=stylesheet]').evaluateAll((links) =>
    links.map((l) => l.getAttribute('href'))
  );
  expect(sheets).toEqual(['design-system.css', 'article.css']);

  await page.goto('/');
  const landingSheets = await page.locator('link[rel=stylesheet]').evaluateAll((links) =>
    links.map((l) => l.getAttribute('href'))
  );
  expect(landingSheets).toEqual(['design-system.css', 'landing.css']);
});

test('has no detectable WCAG 2 A/AA accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
