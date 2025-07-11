import { defineConfig, devices } from "@playwright/test";

const getRandomPort = () => Math.floor(Math.random() * (65000 - 10000) + 10000);

// Use environment variable if set, otherwise generate a new port
const port = process.env.PLAYWRIGHT_TEST_PORT
  ? parseInt(process.env.PLAYWRIGHT_TEST_PORT)
  : getRandomPort();

// Set it in env to ensure consistency across config reloads
process.env.PLAYWRIGHT_TEST_PORT = String(port);

const isTestBuildMode = process.env.TEST_MODE === "build";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./tests/results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    // trace: "on-first-retry",
    headless: true,
    navigationTimeout: 30000,
    channel: "chromium",
  },

  projects: [
    {
      name: "main",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/screenshots.spec.ts",
    },
    {
      name: "screenshots",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/screenshots.spec.ts",
    },
  ],

  webServer: isTestBuildMode
    ? {
        port,
        command: `npm run build && npm run start -- --port ${port}`,
        reuseExistingServer: false,
        timeout: 180 * 1000, // Increased timeout for build
        stdout: "pipe",
        stderr: "pipe",
      }
    : {
        port,
        command: `npm run dev -- --port ${port}`,
        reuseExistingServer: false,
        timeout: 120 * 1000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
