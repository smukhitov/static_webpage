// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expectClearOfStickyNav } from './nav-clearance.js';

// The landing page is the index for both parts; the order here is the order
// the rows must appear in, and every href must resolve to a real section.
const CHAPTERS = [
  { title: 'What Is Machine Learning?', page: 'fundamentals.html', target: 'what-is-ml' },
  { title: 'Supervised, Unsupervised, Reinforcement', page: 'fundamentals.html', target: 'learning-types' },
  { title: 'How a Model Actually Learns', page: 'fundamentals.html', target: 'how-models-learn' },
  { title: 'The Train/Test Split', page: 'fundamentals.html', target: 'train-test-split' },
  { title: 'Overfitting', page: 'fundamentals.html', target: 'overfitting' },
  { title: 'Measuring a Model Honestly', page: 'fundamentals.html', target: 'evaluation' },
  { title: 'Common Algorithms', page: 'fundamentals.html', target: 'common-algorithms' },
  { title: 'Neural Networks and Deep Learning', page: 'modern-ai.html', target: 'neural-networks' },
  { title: 'Tokens and Embeddings', page: 'modern-ai.html', target: 'tokens-embeddings' },
  { title: 'The Transformer Architecture', page: 'modern-ai.html', target: 'transformers' },
  { title: 'Attention, Step by Step', page: 'modern-ai.html', target: 'attention' },
  { title: 'Large Language Models', page: 'modern-ai.html', target: 'llms' },
  { title: 'AI Agents', page: 'modern-ai.html', target: 'agents' },
  { title: 'Retrieval-Augmented Generation', page: 'modern-ai.html', target: 'rag' },
  { title: 'Where These Systems Break', page: 'modern-ai.html', target: 'limits' },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('is the index for both parts, in order', async ({ page }) => {
  await expect(page).toHaveTitle('Machine Learning Fundamentals');
  await expect(page.locator('h1')).toHaveText(/Machine learning,\s*explained from the beginning\./);

  expect(await page.locator('.chapter .chapter-title').allTextContents()).toEqual(
    CHAPTERS.map((c) => c.title)
  );

  await expect(page.locator('.part')).toHaveCount(2);
  await expect(page.locator('#part-foundations .chapter')).toHaveCount(7);
  await expect(page.locator('#part-modern .chapter')).toHaveCount(8);
});

test('every chapter links to a section that exists on its article page', async ({ page }) => {
  const hrefs = await page
    .locator('.chapter')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  expect(hrefs).toEqual(CHAPTERS.map((c) => `${c.page}#${c.target}`));

  for (const article of ['fundamentals.html', 'modern-ai.html']) {
    await page.goto(`/${article}`);
    for (const { target } of CHAPTERS.filter((c) => c.page === article)) {
      await expect(page.locator(`#${target}`)).toHaveCount(1);
    }
  }
});

test('the nav reaches both parts and the first chapter', async ({ page }) => {
  await expectClearOfStickyNav(page, page.locator('.site-nav a[href="#part-foundations"]'));

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

test('fits a phone screen without the page scrolling sideways', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const { doc, win } = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
  }));
  expect(doc).toBeLessThanOrEqual(win);
});

test('has no detectable WCAG 2 A/AA accessibility violations', async ({ page }) => {
  // Under reduced motion the reveal never engages, so every row is opaque from
  // the start. Toggling it on instead would leave axe measuring rows mid-fade,
  // where the blended colours fail contrast for as long as the transition runs.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/js-reveal/);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});
