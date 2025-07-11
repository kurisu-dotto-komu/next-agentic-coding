import { expect, test } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display hello banner", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Hello! 👋" })).toBeVisible();
  });

  test("should display welcome message", async ({ page }) => {
    await expect(page.getByText("Welcome to our Next.js application")).toBeVisible();
  });

  test("should have link to tamagochi page", async ({ page }) => {
    const tamagochiLink = page.getByRole("link", { name: "Go to Tamagochi World" });
    await expect(tamagochiLink).toBeVisible();
    await expect(tamagochiLink).toHaveAttribute("href", "/tamagochi");
  });

  test("should navigate to tamagochi page when link is clicked", async ({ page }) => {
    await page.getByRole("link", { name: "Go to Tamagochi World" }).click();

    // Wait for navigation
    await page.waitForURL("/tamagochi");

    // Verify we're on the tamagochi page
    await expect(page.getByRole("heading", { name: "Multiplayer Tamagochi" })).toBeVisible();
  });

  test("should have centered content", async ({ page }) => {
    // Check that the main container has centering classes
    const mainContainer = page.locator(".flex.min-h-screen");
    await expect(mainContainer).toHaveClass(/items-center/);
    await expect(mainContainer).toHaveClass(/justify-center/);
  });

  test("should have proper styling on button", async ({ page }) => {
    const button = page.getByRole("link", { name: "Go to Tamagochi World" });

    // Check for blue background
    await expect(button).toHaveClass(/bg-blue-500/);

    // Check hover state by hovering
    await button.hover();
    await expect(button).toHaveClass(/hover:bg-blue-600/);
  });
});
