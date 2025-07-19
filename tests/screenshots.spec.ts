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

test.describe("Screenshots: Voting App Default Views", () => {
  test("Desktop View", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await takeScreenshot(page, "/", "voting-desktop-default");
  });

  test("Mobile View", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await takeScreenshot(page, "/", "voting-mobile-default");
  });
});

test.describe("Screenshots: Voting App", () => {
  test("Voting Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loadSeed("empty");
    await takeScreenshot(page, "/", "voting-mobile");
  });

  test("Voting Mobile Active", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loadSeed("empty");
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const oButton = page.getByTestId("vote-button-O");
    await oButton.dispatchEvent("mousedown");
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `tests/screenshots/voting-mobile-active.png`,
      fullPage: true,
    });

    await oButton.dispatchEvent("mouseup");
  });

  test("Voting Desktop Empty", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loadSeed("empty");
    await takeScreenshot(page, "/", "voting-desktop-empty");
  });

  test("Voting Desktop Active", async ({ page, context }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loadSeed("empty");
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Add some mobile voters
    const voters = [];
    for (let i = 0; i < 5; i++) {
      const mobile = await context.newPage();
      await mobile.setViewportSize({ width: 375, height: 667 });
      await mobile.goto("/");
      voters.push(mobile);
    }

    await page.waitForTimeout(2000);

    // Have some users vote
    await voters[0].getByTestId("vote-button-O").dispatchEvent("mousedown");
    await voters[1].getByTestId("vote-button-X").dispatchEvent("mousedown");
    await voters[2].getByTestId("vote-button-O").dispatchEvent("mousedown");

    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `tests/screenshots/voting-desktop-active.png`,
      fullPage: true,
    });

    // Clean up
    for (const voter of voters) {
      await voter.close();
    }
  });
});
