// @ts-check
import { defineConfig, devices } from '@playwright/test';

// The suite runs against the built site, not the dev server: dist/ is what
// Vercel serves, and it is the only place where the React landing page and the
// two still-static article pages sit side by side.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx http-server dist -p 4173 -s',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
