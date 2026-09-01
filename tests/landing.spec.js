// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const CHAPTERS = [
  { title: 'What Is Machine Learning?', target: 'what-is-ml' },
  { title: 'Supervised, Unsupervised, Reinforcement', target: 'learning-types' },
  { title: 'The Train/Test Split', target: 'train-test-split' },
  { title: 'Overfitting', target: 'overfitting' },
  { title: 'Common Algorithms', target: 'common-algorithms' },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('the landing page is served at the site root', async ({ page }) => {
  await expect(page).toHaveTitle('Machine Learning Fundamentals');
  await expect(page.locator('h1')).toHaveText(/Machine learning,\s*explained from the beginning\./);
});

test('lists all five chapters in order', async ({ page }) => {
  const titles = await page.locator('.chapter .chapter-title').allTextContents();
  expect(titles).toEqual(CHAPTERS.map((c) => c.title));
});

test('every chapter links to a section that exists on the article page', async ({ page }) => {
  const hrefs = await page.locator('.chapter').evaluateAll((links) =>
    links.map((a) => a.getAttribute('href'))
  );
  expect(hrefs).toEqual(CHAPTERS.map((c) => `fundamentals.html#${c.target}`));

  await page.goto('/fundamentals.html');
  for (const { target } of CHAPTERS) {
    await expect(page.locator(`#${target}`)).toHaveCount(1);
  }
});

test('the primary call to action opens the article', async ({ page }) => {
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL(/\/fundamentals\.html#what-is-ml$/);
  await expect(page.locator('#what-is-ml')).toBeVisible();
});

test('chapters are revealed once scrolled into view', async ({ page }) => {
  const last = page.locator('.chapter').last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/is-revealed/);
  await expect(last).toHaveCSS('opacity', '1');
});

test('has no detectable WCAG 2 A/AA accessibility violations', async ({ page }) => {
  // Under reduced motion the reveal never engages, so every row is opaque from
  // the start. Toggling it on instead would leave axe measuring rows mid-fade,
  // where the blended colours fail contrast for as long as the transition runs.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/js-reveal/);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
