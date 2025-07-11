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

  test("should have link to todo page", async ({ page }) => {
    const todoLink = page.getByRole("link", { name: "Go to Todo List" });
    await expect(todoLink).toBeVisible();
    await expect(todoLink).toHaveAttribute("href", "/todo");
  });

  test("should navigate to todo page when link is clicked", async ({ page }) => {
    await page.getByRole("link", { name: "Go to Todo List" }).click();

    // Wait for navigation
    await page.waitForURL("/todo");

    // Verify we're on the todo page
    await expect(page.getByRole("heading", { name: "Todo List" })).toBeVisible();
  });

  test("should have centered content", async ({ page }) => {
    // Check that the main container has centering classes
    const mainContainer = page.locator(".flex.min-h-screen");
    await expect(mainContainer).toHaveClass(/items-center/);
    await expect(mainContainer).toHaveClass(/justify-center/);
  });

  test("should have proper styling on button", async ({ page }) => {
    const button = page.getByRole("link", { name: "Go to Todo List" });

    // Check for blue background
    await expect(button).toHaveClass(/bg-blue-500/);

    // Check hover state by hovering
    await button.hover();
    await expect(button).toHaveClass(/hover:bg-blue-600/);
  });
});
