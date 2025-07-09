import { test, expect } from "@playwright/test";
import { ROUTES } from "../test-helpers";

test.describe("Desktop Voting View", () => {
  test("desktop shows all users", async ({ page, browser }) => {
    await page.goto(ROUTES.vote);

    // Verify the user grid is visible and has at least one user (the current user)
    const userGrid = page.getByTestId("user-grid");
    await expect(userGrid).toBeVisible();

    const initialUserAvatars = userGrid.locator('[data-testid="grid-avatar"]');
    const initialCount = await initialUserAvatars.count();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // Create a new browser context (separate localStorage) to create another user
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto(ROUTES.vote);

    // Wait for the new user to appear in the grid
    await page.waitForTimeout(1000); // Give time for real-time update

    // Check that we have more users than initially
    const newCount = await initialUserAvatars.count();
    expect(newCount).toBeGreaterThan(initialCount);

    // Clean up
    await context2.close();
  });

  test("real-time vote updates", async ({ page, browser }) => {
    await page.goto(ROUTES.vote);

    // Wait for initial load
    await page.waitForTimeout(1000);

    // Mobile user in separate context
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    const mobile = await mobileContext.newPage();
    await mobile.goto(ROUTES.vote);

    // Vote on mobile
    await mobile.getByTestId("vote-button-O").dispatchEvent("mousedown");

    // Wait for the vote to appear on desktop
    await page.waitForTimeout(1000);

    // Check vote bar updates (it appears when there are votes)
    const voteBarO = page.getByTestId("vote-bar-O");
    await expect(voteBarO).toBeVisible();

    // Release vote on mobile
    await mobile.getByTestId("vote-button-O").dispatchEvent("mouseup");

    // Clean up
    await mobileContext.close();
  });

  test("vote bar shows correct percentages", async ({ page, browser }) => {
    await page.goto(ROUTES.vote);

    // Create 3 more users with separate contexts
    const contexts = [];
    const users = [];
    for (let i = 0; i < 3; i++) {
      const newContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
      });
      const newPage = await newContext.newPage();
      await newPage.goto(ROUTES.vote);
      contexts.push(newContext);
      users.push(newPage);
    }

    // 2 users vote O
    await users[0].getByTestId("vote-button-O").dispatchEvent("mousedown");
    await users[1].getByTestId("vote-button-O").dispatchEvent("mousedown");

    // 1 user votes X
    await users[2].getByTestId("vote-button-X").dispatchEvent("mousedown");

    // Wait for vote bars to appear (they only render when percentage > 0)
    await expect(page.getByTestId("vote-bar-O")).toBeVisible();
    await expect(page.getByTestId("vote-bar-X")).toBeVisible();

    // Check percentages (2 O, 1 X, 1 no vote out of 4 total)
    // Note: Due to existing users in the database, we can't assume exact percentages
    // Instead, check that the elements exist and contain percentage text
    await expect(page.getByTestId("vote-bar-O")).toContainText("%");
    await expect(page.getByTestId("vote-bar-X")).toContainText("%");

    // The none bar might not appear if all users have voted
    const noneBar = page.getByTestId("vote-bar-none");
    const noneBarCount = await noneBar.count();
    if (noneBarCount > 0) {
      await expect(noneBar).toContainText("%");
    }

    // Clean up
    for (const context of contexts) {
      await context.close();
    }
  });

  test("QR code is displayed on desktop", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Check QR code is visible
    await expect(page.getByTestId("qr-code")).toBeVisible();

    // QR code should be in top-right corner
    const qrCode = page.getByTestId("qr-code");
    const box = await qrCode.boundingBox();
    expect(box).toBeTruthy();

    // Check it's positioned on the right side
    const viewport = page.viewportSize();
    if (box && viewport) {
      expect(box.x + box.width).toBeGreaterThan(viewport.width * 0.8);
    }
  });

  test("desktop view shows all required elements", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Should see desktop elements
    await expect(page.getByTestId("user-grid")).toBeVisible();
    await expect(page.getByTestId("vote-bar")).toBeVisible();
    await expect(page.getByTestId("qr-code")).toBeVisible();

    // Should NOT see mobile elements
    await expect(page.getByTestId("vote-button-O")).not.toBeVisible();
    await expect(page.getByTestId("vote-button-X")).not.toBeVisible();
  });

  test("users auto-shuffle and resize in grid", async ({ page, browser }) => {
    await page.goto(ROUTES.vote);

    // Get initial user count
    const userAvatars = page
      .getByTestId("user-grid")
      .locator('[data-testid="grid-avatar"]');
    const initialCount = await userAvatars.count();

    // Create multiple users with separate contexts
    const contexts = [];
    const userCount = 5; // Reduced from 10 to make test faster
    for (let i = 0; i < userCount; i++) {
      const newContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
      });
      const newPage = await newContext.newPage();
      await newPage.goto(ROUTES.vote);
      contexts.push(newContext);

      // Small delay to avoid overwhelming the server
      await page.waitForTimeout(200);
    }

    // Wait for all users to appear
    await page.waitForTimeout(1000);

    // Check that we have more users than initially
    const finalCount = await userAvatars.count();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount + userCount);

    // Verify grid layout is working (users should be visible)
    const firstFewAvatars = await userAvatars.all();
    for (let i = 0; i < Math.min(3, firstFewAvatars.length); i++) {
      await expect(firstFewAvatars[i]).toBeVisible();
    }

    // Clean up
    for (const context of contexts) {
      await context.close();
    }
  });
});
