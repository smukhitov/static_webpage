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
  await page.goto('/index.html');
});

test('has the expected page title', async ({ page }) => {
  await expect(page).toHaveTitle('Machine Learning Fundamentals');
});

test('renders all five section headings in order', async ({ page }) => {
  const headings = await page.locator('main section h2').allTextContents();
  expect(headings).toEqual(SECTION_HEADINGS);
});

test('nav links resolve to existing section ids', async ({ page }) => {
  const hrefs = await page.locator('nav a').evaluateAll((links) =>
    links.map((a) => a.getAttribute('href'))
  );
  expect(hrefs.length).toBe(5);
  for (const href of hrefs) {
    const id = href.replace('#', '');
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
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

test('has no detectable WCAG 2 A/AA accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
