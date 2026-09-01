// @ts-check
const { test, expect } = require('@playwright/test');
const { describeArticlePage } = require('./article-page');

describeArticlePage({
  path: '/modern-ai.html',
  title: 'Machine Learning Fundamentals — Part II: Transformers, LLMs and Agents',
  stylesheet: 'article.css',
  diagrams: 11,
  headings: [
    'Neural Networks and Deep Learning',
    'Tokens and Embeddings',
    'The Transformer Architecture',
    'Attention, Step by Step',
    'Large Language Models',
    'AI Agents',
    'Retrieval-Augmented Generation',
    'Where These Systems Break',
  ],
});

test('opens with a roadmap of the chain it covers', async ({ page }) => {
  await page.goto('/modern-ai.html');
  await expect(page.locator('main > header svg.diagram')).toHaveCount(1);
});

test('tabulates the failure modes with a mitigation for each', async ({ page }) => {
  await page.goto('/modern-ai.html');
  const table = page.locator('#limits table.table');
  await expect(table.locator('thead th')).toHaveCount(3);

  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    await expect(rows.nth(i).locator('td')).toHaveCount(3);
  }
});

test('links back to Part I', async ({ page }) => {
  await page.goto('/modern-ai.html');
  await page.locator('.pager-link').first().click();
  await expect(page).toHaveURL(/\/fundamentals\.html#common-algorithms$/);
});
