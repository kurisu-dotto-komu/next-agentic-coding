import { type Page, test } from "@playwright/test";

import { loadSeed } from "./helpers/seed";

async function takeScreenshot(
  page: Page,
  path: string,
  name: string,
  colorScheme: "light" | "dark" = "light",
) {
  // Set color scheme
  await page.emulateMedia({ colorScheme });

  await page.goto(path);
  await page.waitForLoadState("networkidle");

  const suffix = colorScheme === "dark" ? "-dark" : "";
  await page.screenshot({
    path: `tests/screenshots/${name}${suffix}.png`,
    fullPage: true,
  });
}

test.describe("Screenshots: Landing Page", () => {
  test("Landing Page", async ({ page }) => {
    await takeScreenshot(page, "/", "landing-page");
  });

  test("Landing Page Dark Mode", async ({ page }) => {
    await takeScreenshot(page, "/", "landing-page", "dark");
  });
});

test.describe("Screenshots: Tamagochi App", () => {
  test("Empty State", async ({ page }) => {
    // Load empty seed to ensure clean state
    await loadSeed("empty");
    await takeScreenshot(page, "/tamagochi", "tamagochi-empty");
  });

  test("Active Tamagochis", async ({ page }) => {
    // Load sample tamagochis
    await loadSeed("sample-tamagochis");
    await takeScreenshot(page, "/tamagochi", "tamagochi-active");
  });

  test("User with Tamagochi", async ({ page }) => {
    // Load sample tamagochis first
    await loadSeed("sample-tamagochis");

    // Navigate to the page first
    await page.goto("/tamagochi");

    // Set user ID after navigation
    await page.evaluate(() => {
      localStorage.setItem("tamagochi-user-id", "user-test-1");
    });

    // Reload to pick up the localStorage change
    await page.reload();

    // Wait for content to load
    await page.waitForTimeout(500);

    // Take screenshot without navigating again
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `tests/screenshots/tamagochi-user.png`,
      fullPage: true,
    });
  });
});
