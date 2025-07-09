import { test, expect } from "@playwright/test";
import { ROUTES } from "../test-helpers";

test.describe("Mobile Voting View", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("mobile user gets unique avatar", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Check avatar is visible
    await expect(page.getByTestId("user-avatar")).toBeVisible();

    // Get the initial avatar HTML/src to compare later
    const initialAvatar = await page.getByTestId("user-avatar").innerHTML();

    // Refresh and verify avatar persists
    await page.reload();
    await expect(page.getByTestId("user-avatar")).toBeVisible();

    // Avatar should be the same after refresh (persistent)
    const refreshedAvatar = await page.getByTestId("user-avatar").innerHTML();
    expect(refreshedAvatar).toBe(initialAvatar);
  });

  test("voting updates avatar display", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Press O button
    const oButton = page.getByTestId("vote-button-O");
    await oButton.dispatchEvent("mousedown");

    // Check whiteboard appears
    await expect(page.getByTestId("vote-whiteboard")).toBeVisible();
    await expect(page.getByTestId("vote-whiteboard")).toContainText("O");

    // Release and check it disappears
    await oButton.dispatchEvent("mouseup");
    // Wait a bit for the vote to clear
    await page.waitForTimeout(100);
    await expect(page.getByTestId("vote-whiteboard")).not.toBeVisible();
  });

  test("X button voting works", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Press X button
    const xButton = page.getByTestId("vote-button-X");
    await xButton.dispatchEvent("mousedown");

    // Check whiteboard appears with X
    await expect(page.getByTestId("vote-whiteboard")).toBeVisible();
    await expect(page.getByTestId("vote-whiteboard")).toContainText("X");

    // Release and check it disappears
    await xButton.dispatchEvent("mouseup");
    await page.waitForTimeout(100);
    await expect(page.getByTestId("vote-whiteboard")).not.toBeVisible();
  });

  test("vote buttons are responsive to touch events", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Test touch events on O button
    const oButton = page.getByTestId("vote-button-O");
    await oButton.dispatchEvent("touchstart");
    await expect(page.getByTestId("vote-whiteboard")).toBeVisible();

    await oButton.dispatchEvent("touchend");
    await page.waitForTimeout(100);
    await expect(page.getByTestId("vote-whiteboard")).not.toBeVisible();
  });

  test("mobile view shows only voting interface", async ({ page }) => {
    await page.goto(ROUTES.vote);

    // Should see avatar and vote buttons
    await expect(page.getByTestId("user-avatar")).toBeVisible();
    await expect(page.getByTestId("vote-button-O")).toBeVisible();
    await expect(page.getByTestId("vote-button-X")).toBeVisible();

    // Should NOT see desktop elements
    await expect(page.getByTestId("user-grid")).not.toBeVisible();
    await expect(page.getByTestId("vote-bar")).not.toBeVisible();
    await expect(page.getByTestId("qr-code")).not.toBeVisible();
  });
});
