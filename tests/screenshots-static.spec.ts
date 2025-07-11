import { test } from "@playwright/test";
import { SCREENSHOT_DIR } from "./test-helpers";

test.describe("Screenshot static pages and UI", () => {
  test("screenshot home page variations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Full page screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-hero.png`,
      fullPage: true,
    });

    // Just the hero section
    const heroSection = await page.locator("main").first();
    await heroSection.screenshot({
      path: `${SCREENSHOT_DIR}/home-hero-section.png`,
    });

    // Hover on Play Now button
    await page.hover("text=Play Now");
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-play-hover.png`,
      fullPage: false,
    });
  });

  test("screenshot character creation UI", async ({ page }) => {
    await page.goto("/character");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Initial state
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/character-empty-form.png`,
      fullPage: true,
    });

    // Fill form
    await page.fill(
      'input[placeholder="Enter your barista name"]',
      "CoffeeLover",
    );

    // Click randomize multiple times
    for (let i = 0; i < 3; i++) {
      await page.click("text=Randomize Avatar");
      await page.waitForTimeout(300);
    }

    // Adjust sliders
    const sliders = await page.locator('input[type="range"]').all();
    if (sliders.length >= 2) {
      await sliders[0].fill("5"); // Max strength
      await sliders[1].fill("1"); // Min sweetness
    }

    // Select different milk
    const milkSelect = await page.locator("select");
    if (await milkSelect.isVisible()) {
      await milkSelect.selectOption("oat");
    }

    // Screenshot with filled form
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/character-filled-form.png`,
      fullPage: true,
    });

    // Focus on avatar
    const avatarSection = await page
      .locator('img[alt="Character avatar"]')
      .locator("..");
    if (await avatarSection.isVisible()) {
      await avatarSection.screenshot({
        path: `${SCREENSHOT_DIR}/character-avatar-close.png`,
      });
    }
  });

  test("screenshot error states", async ({ page }) => {
    // Leaderboard without player
    await page.goto("/leaderboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/leaderboard-no-player.png`,
      fullPage: true,
    });

    // Game page without player (should redirect)
    await page.goto("/game");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-redirect-state.png`,
      fullPage: true,
    });
  });

  test("screenshot responsive views", async ({ page }) => {
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-mobile.png`,
      fullPage: true,
    });

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/character");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/character-tablet.png`,
      fullPage: true,
    });

    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-desktop.png`,
      fullPage: false,
    });
  });

  test("screenshot UI components", async ({ page }) => {
    await page.goto("/character");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Button states
    const createButton = await page.locator("text=Create Character");
    if (await createButton.isVisible()) {
      await createButton.screenshot({
        path: `${SCREENSHOT_DIR}/ui-button-primary.png`,
      });
    }

    const randomizeButton = await page.locator("text=Randomize Avatar");
    if (await randomizeButton.isVisible()) {
      await randomizeButton.screenshot({
        path: `${SCREENSHOT_DIR}/ui-button-secondary.png`,
      });
    }

    // Card component
    const card = await page.locator(".bg-white").first();
    if (await card.isVisible()) {
      await card.screenshot({
        path: `${SCREENSHOT_DIR}/ui-card.png`,
      });
    }

    // Slider component
    const slider = await page.locator('input[type="range"]').first();
    if (await slider.isVisible()) {
      const sliderContainer = await slider.locator("..");
      await sliderContainer.screenshot({
        path: `${SCREENSHOT_DIR}/ui-slider.png`,
      });
    }
  });
});
