import { defineConfig, devices } from "@playwright/test"

/**
 * Liquid Glass / PWA smoke across the engines that stand in for:
 * Windows (Chromium), macOS (WebKit), Linux (Firefox), Android (Pixel), iOS (iPhone).
 * Does not boot Medusa — only the overlay CSS. Default `e2e` stays Chromium-only.
 */
export default defineConfig({
  testDir: "./platforms",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"]]
    : [["list"]],
  use: {
    trace: "on-first-retry",
  },
  projects: [
    { name: "windows", use: { ...devices["Desktop Chrome"] } },
    { name: "macos", use: { ...devices["Desktop Safari"] } },
    { name: "linux", use: { ...devices["Desktop Firefox"] } },
    { name: "android", use: { ...devices["Pixel 7"] } },
    { name: "ios", use: { ...devices["iPhone 14"] } },
  ],
})
