// @ts-check
import { expect } from '@playwright/test';

/**
 * Follows an anchor link and asserts the section it targets lands clear of the
 * sticky nav. `--nav-height` is a transcription of a measured layout and has
 * gone stale before, so this checks the outcome rather than the number.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} link  the anchor link to follow
 */
export async function expectClearOfStickyNav(page, link) {
  const href = await link.getAttribute('href');
  expect(href, 'the link has no href to follow').toBeTruthy();

  // Anchor jumps animate, and the web fonts reflow the page under a scroll
  // position already chosen. Settle both before jumping.
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await link.click();

  const gap = await page.evaluate((selector) => {
    const nav = document.querySelector('.site-nav');
    if (getComputedStyle(nav).position !== 'sticky') return null;
    const section = document.querySelector(selector).getBoundingClientRect();
    return section.top - nav.getBoundingClientRect().bottom;
  }, href);

  expect(gap, 'the nav is not sticky here, so the check proves nothing').not.toBeNull();
  expect(gap, `${href} sits under the sticky nav`).toBeGreaterThanOrEqual(0);
}
