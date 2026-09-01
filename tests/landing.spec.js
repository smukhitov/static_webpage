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
  await page.goto('/landing.html');
});

test('has the expected page title', async ({ page }) => {
  await expect(page).toHaveTitle('Machine Learning Fundamentals — Start Here');
});

test('lists all five chapters in order', async ({ page }) => {
  const titles = await page.locator('.chapter .chapter-title').allTextContents();
  expect(titles).toEqual(CHAPTERS.map((c) => c.title));
});

test('every chapter links to a section that exists on the article page', async ({ page }) => {
  const hrefs = await page.locator('.chapter').evaluateAll((links) =>
    links.map((a) => a.getAttribute('href'))
  );
  expect(hrefs).toEqual(CHAPTERS.map((c) => `index.html#${c.target}`));

  await page.goto('/index.html');
  for (const { target } of CHAPTERS) {
    await expect(page.locator(`#${target}`)).toHaveCount(1);
  }
});

test('the primary call to action opens the article', async ({ page }) => {
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL(/\/index\.html#what-is-ml$/);
  await expect(page.locator('#what-is-ml')).toBeVisible();
});

test('chapters are revealed once scrolled into view', async ({ page }) => {
  const last = page.locator('.chapter').last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/is-revealed/);
  await expect(last).toHaveCSS('opacity', '1');
});

test('has no detectable WCAG 2 A/AA accessibility violations', async ({ page }) => {
  // Reveal every row first: axe cannot judge contrast on a fully transparent
  // element, and would report those as incomplete rather than checking them.
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  });

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
