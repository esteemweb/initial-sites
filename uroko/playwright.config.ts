import { defineConfig, devices } from "@playwright/test";

// Smoke tests against a production build. Uses the installed Chrome so no
// browser download is needed. Run: npm test
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3012",
    trace: "retain-on-failure",
    // The site honours prefers-reduced-motion (instant scroll, no reveals),
    // which keeps element-stability checks deterministic.
    reducedMotion: "reduce",
  },
  projects: [
    { name: "phone", use: { ...devices["Pixel 7"], channel: "chrome" } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  ],
  webServer: {
    command: "npx next start -p 3012",
    url: "http://localhost:3012",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
