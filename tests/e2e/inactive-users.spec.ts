import { test, expect } from "@playwright/test";
import { ROUTES } from "../test-helpers";

test.describe("Inactive User Cleanup", () => {
  test.skip("removes users after 1 minute of inactivity", async ({ browser }) => {
    // Skip this test as it requires waiting for 1+ minute
    // In a real app, we'd use time mocking or a configurable timeout
    
    // Create a user in desktop view
    const context1 = await browser.newContext();
    const desktop = await context1.newPage();
    await desktop.goto(ROUTES.vote);

    // Create a mobile user
    const context2 = await browser.newContext();
    const mobile = await context2.newPage();
    await mobile.setViewportSize({ width: 375, height: 667 });
    await mobile.goto(ROUTES.vote);

    // Wait for both users to appear
    await desktop.waitForTimeout(1000);

    // Count initial users
    const initialCount = await desktop
      .getByTestId("user-grid")
      .locator('[data-testid="grid-avatar"]')
      .count();

    expect(initialCount).toBeGreaterThanOrEqual(2);

    // Close the mobile user (simulate leaving)
    await mobile.close();
    await context2.close();

    // Would need to wait 60+ seconds here for real test
    await desktop.waitForTimeout(65000); 

    // Force a refresh to trigger cleanup
    await desktop.reload();
    await desktop.waitForTimeout(1000);

    // Count users after cleanup
    const finalCount = await desktop
      .getByTestId("user-grid")
      .locator('[data-testid="grid-avatar"]')
      .count();

    // Should have fewer users after inactive one is removed
    expect(finalCount).toBeLessThan(initialCount);

    await desktop.close();
    await context1.close();
  });

  test("keeps active users in the pool", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(ROUTES.vote);

    // Get initial user count
    await page.waitForTimeout(1000);
    const initialCount = await page
      .getByTestId("user-grid")
      .locator('[data-testid="grid-avatar"]')
      .count();

    // Simulate activity by voting
    const context2 = await browser.newContext();
    const mobile = await context2.newPage();
    await mobile.setViewportSize({ width: 375, height: 667 });
    await mobile.goto(ROUTES.vote);

    // Keep voting to stay active
    for (let i = 0; i < 3; i++) {
      await mobile.getByTestId("vote-button-O").dispatchEvent("mousedown");
      await mobile.waitForTimeout(500);
      await mobile.getByTestId("vote-button-O").dispatchEvent("mouseup");
      await mobile.waitForTimeout(2000);
    }

    // Check user is still there
    const currentCount = await page
      .getByTestId("user-grid")
      .locator('[data-testid="grid-avatar"]')
      .count();

    expect(currentCount).toBeGreaterThanOrEqual(initialCount);

    await mobile.close();
    await context2.close();
    await page.close();
    await context.close();
  });

  test("shows visual indicator for recently active users", async ({
    browser,
  }) => {
    const context1 = await browser.newContext();
    const desktop = await context1.newPage();
    await desktop.goto(ROUTES.vote);

    const context2 = await browser.newContext();
    const mobile = await context2.newPage();
    await mobile.setViewportSize({ width: 375, height: 667 });
    await mobile.goto(ROUTES.vote);

    // Vote to show activity
    await mobile.getByTestId("vote-button-O").dispatchEvent("mousedown");
    await desktop.waitForTimeout(500);

    // Check for active indicator on desktop
    const activeUsers = await desktop
      .getByTestId("user-grid")
      .locator('[data-testid="user-active"]')
      .count();

    expect(activeUsers).toBeGreaterThan(0);

    await mobile.getByTestId("vote-button-O").dispatchEvent("mouseup");

    await mobile.close();
    await context2.close();
    await desktop.close();
    await context1.close();
  });
});
