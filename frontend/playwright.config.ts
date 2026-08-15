import { defineConfig, devices } from '@playwright/test';

// Derived from the project creation date (2026-04-22), matching vite.config.ts.
const backendPort = Number(process.env.PORT ?? 10422);
const devServerPort = Number(process.env.VITE_PORT ?? backendPort + 1);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${devServerPort}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -w backend',
      url: `http://localhost:${backendPort}/v1/health`,
      reuseExistingServer: !process.env.CI,
      cwd: '../',
    },
    {
      command: 'npm run dev -w frontend',
      url: `http://localhost:${devServerPort}`,
      reuseExistingServer: !process.env.CI,
      cwd: '../',
    },
  ],
});
