// @ts-check
import { test, expect } from '@playwright/test';
import { describeArticlePage } from './article-page.js';

describeArticlePage({
  path: '/fundamentals.html',
  title: 'Machine Learning Fundamentals — Part I: Foundations',
  stylesheet: 'article.css',
  diagrams: 7,
  headings: [
    'What Is Machine Learning?',
    'Supervised, Unsupervised, and Reinforcement Learning',
    'How a Model Actually Learns',
    'The Train/Test Split',
    'Overfitting',
    'Measuring a Model Honestly',
    'Common Algorithms',
  ],
});

test('hands the reader on to Part II', async ({ page }) => {
  await page.goto('/fundamentals.html');
  await page.locator('.pager-next').click();
  await expect(page).toHaveURL(/\/modern-ai\.html#neural-networks$/);
  await expect(page.locator('#neural-networks')).toBeVisible();
});
