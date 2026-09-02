// @ts-check
import { defineConfig, devices } from '@playwright/test';

// The suite runs against dist/ rather than the dev server: dist/ is what Vercel
// serves, and the only place the React and static halves sit side by side.
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
