import { test, expect } from "@playwright/test";
import { SCREENSHOT_DIR } from "./test-helpers";

test.describe("Screenshot game features", () => {
  // Create a test player before running game tests
  test.beforeEach(async ({ page }) => {
    // Check if Convex is available
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Go to character creation
    await page.goto("/character");
    await page.waitForLoadState("networkidle");

    // Wait for page to be ready
    await page.waitForTimeout(2000);

    // Fill in character details
    const nameInput = await page.locator(
      'input[placeholder="Enter your barista name"]',
    );
    await nameInput.fill("TestPlayer" + Date.now()); // Add timestamp to ensure unique name

    // Randomize avatar
    const randomizeButton = await page.locator("text=Randomize Avatar");
    if (await randomizeButton.isVisible()) {
      await randomizeButton.click();
      await page.waitForTimeout(500);
    }

    // Create character
    const createButton = await page.locator("text=Create Character");
    if (await createButton.isEnabled()) {
      await createButton.click();

      // Wait for either navigation or error
      try {
        await page.waitForURL("/game", { timeout: 5000 });
        await page.waitForLoadState("networkidle");
      } catch (e) {
        // If navigation fails, we might be in a state where Convex isn't connected
        console.log(
          "Navigation to game failed, might be missing Convex connection",
        );
      }
    }
  });

  test("screenshot coffee shop with player", async ({ page }) => {
    // Take screenshot of the coffee shop
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-coffee-shop.png`,
      fullPage: true,
    });
  });

  test("screenshot brewing station mini-game", async ({ page }) => {
    // Click on brewing station
    await page.click('[data-testid="brewing-station"]');
    await page.waitForTimeout(1000);

    // Take screenshot of brewing game modal
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-brewing-station.png`,
      fullPage: true,
    });

    // Add some ingredients
    await page.click("text=Espresso");
    await page.click("text=Milk");
    await page.click("text=Vanilla");

    // Adjust temperature
    const tempPlusButton = await page.locator('button:has-text("+")').first();
    await tempPlusButton.click();
    await tempPlusButton.click();

    // Take screenshot with ingredients selected
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-brewing-with-ingredients.png`,
      fullPage: true,
    });

    // Complete brewing
    await page.click("text=Complete Brew");
    await page.waitForTimeout(2000);

    // Take screenshot of score
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-brewing-score.png`,
      fullPage: true,
    });
  });

  test("screenshot latte art mini-game", async ({ page }) => {
    // Click on latte art station
    await page.click("text=Latte Art");
    await page.waitForTimeout(1000);

    // Take screenshot of latte art canvas
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-latte-art.png`,
      fullPage: true,
    });

    // Draw on canvas
    const canvas = await page.locator("canvas");
    const box = await canvas.boundingBox();
    if (box) {
      // Draw a heart shape
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3);
      await page.mouse.down();

      // Left curve of heart
      for (let i = 0; i <= 20; i++) {
        const angle = (Math.PI * i) / 20;
        const x = box.x + box.width / 2 - 30 * Math.sin(angle);
        const y =
          box.y + box.height / 3 - 20 * Math.cos(angle) + 20 * Math.sin(angle);
        await page.mouse.move(x, y);
      }

      // Right curve of heart
      for (let i = 0; i <= 20; i++) {
        const angle = (Math.PI * i) / 20;
        const x = box.x + box.width / 2 + 30 * Math.sin(angle);
        const y =
          box.y + box.height / 3 - 20 * Math.cos(angle) + 20 * Math.sin(angle);
        await page.mouse.move(x, y);
      }

      // Bottom point
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 20);
      await page.mouse.up();
    }

    // Take screenshot with art
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-latte-art-drawn.png`,
      fullPage: true,
    });

    // Submit art
    await page.click("text=Submit Art");
    await page.waitForTimeout(2000);

    // Take screenshot of score
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-latte-art-score.png`,
      fullPage: true,
    });
  });

  test("screenshot recipe book", async ({ page }) => {
    // Click on recipe book
    await page.click("text=Recipe Book");
    await page.waitForTimeout(1000);

    // Take screenshot of recipe book
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/game-recipe-book.png`,
      fullPage: true,
    });
  });

  test("screenshot leaderboard with player", async ({ page }) => {
    // Navigate to leaderboard
    await page.goto("/leaderboard");
    await page.waitForLoadState("networkidle");

    // Take screenshot of leaderboard
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/leaderboard-with-player.png`,
      fullPage: true,
    });

    // Click different game type filters
    await page.click("text=Brewing");
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/leaderboard-brewing.png`,
      fullPage: true,
    });

    // Click time filter
    await page.click("text=Today");
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/leaderboard-daily.png`,
      fullPage: true,
    });
  });

  test("screenshot character creation flow", async ({ page }) => {
    // Go back to character page to show the flow
    await page.goto("/character");
    await page.waitForLoadState("networkidle");

    // Take initial screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/character-initial.png`,
      fullPage: true,
    });

    // Fill in name
    await page.fill(
      'input[placeholder="Enter your barista name"]',
      "CoffeeMaster",
    );

    // Randomize avatar
    await page.click("text=Randomize Avatar");
    await page.waitForTimeout(500);

    // Adjust preferences
    const strengthSlider = await page.locator('input[type="range"]').first();
    await strengthSlider.fill("5");

    const sweetnessSlider = await page.locator('input[type="range"]').nth(1);
    await sweetnessSlider.fill("2");

    // Select milk preference
    await page.selectOption("select", "oat");

    // Take screenshot with filled form
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/character-filled.png`,
      fullPage: true,
    });
  });
});
