import { test, expect } from "@playwright/test";
import { ROUTES } from "../test-helpers";

test.describe("Active Users Filter", () => {
  test("only shows users active within last minute", async ({ browser, page }) => {
    // Navigate to vote page
    await page.goto(ROUTES.vote);
    
    // Create multiple users in parallel
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all(
      contexts.map(async (context) => {
        const p = await context.newPage();
        await p.setViewportSize({ width: 375, height: 667 });
        await p.goto(ROUTES.vote);
        return p;
      })
    );
    
    // Wait for users to appear
    await page.waitForTimeout(2000);
    
    // All users should be visible initially
    const userCount = await page
      .getByTestId("user-grid")
      .locator('[data-testid="grid-avatar"]')
      .count();
    
    expect(userCount).toBeGreaterThanOrEqual(4); // Original + 3 new users
    
    // Clean up
    await Promise.all(pages.map(p => p.close()));
    await Promise.all(contexts.map(c => c.close()));
  });

  test("visual feedback shows recently active users", async ({ browser }) => {
    const desktop = await browser.newPage();
    await desktop.goto(ROUTES.vote);
    
    // Create an active mobile user
    const mobileContext = await browser.newContext();
    const mobile = await mobileContext.newPage();
    await mobile.setViewportSize({ width: 375, height: 667 });
    await mobile.goto(ROUTES.vote);
    
    // Wait for user to appear
    await desktop.waitForTimeout(1000);
    
    // Make the mobile user vote (become active)
    await mobile.getByTestId("vote-button-O").click();
    await desktop.waitForTimeout(500);
    
    // Check that at least one user has the active indicator
    const activeIndicators = await desktop
      .getByTestId("user-grid")
      .locator('[data-testid="user-active"]')
      .count();
    
    expect(activeIndicators).toBeGreaterThan(0);
    
    // Check the visual ring class is applied
    const activeUserCards = await desktop
      .getByTestId("user-grid")
      .locator('.ring-2.ring-blue-400')
      .count();
    
    expect(activeUserCards).toBeGreaterThan(0);
    
    await mobile.close();
    await mobileContext.close();
    await desktop.close();
  });

  test("user count updates correctly", async ({ browser, page }) => {
    await page.goto(ROUTES.vote);
    
    // Get initial user count from UI
    const initialCountText = await page.textContent('p:has-text("active user")');
    const initialCount = parseInt(initialCountText?.match(/\d+/)?.[0] || "0");
    
    // Create a new user
    const context = await browser.newContext();
    const newUser = await context.newPage();
    await newUser.setViewportSize({ width: 375, height: 667 });
    await newUser.goto(ROUTES.vote);
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Check count increased
    const updatedCountText = await page.textContent('p:has-text("active user")');
    const updatedCount = parseInt(updatedCountText?.match(/\d+/)?.[0] || "0");
    
    expect(updatedCount).toBeGreaterThan(initialCount);
    
    // Check plural form
    if (updatedCount > 1) {
      await expect(page.locator('p:has-text("active users")')).toBeVisible();
    } else {
      await expect(page.locator('p:has-text("active user")')).toBeVisible();
    }
    
    await newUser.close();
    await context.close();
  });
});