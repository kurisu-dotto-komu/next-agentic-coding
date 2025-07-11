import { expect, test } from "@playwright/test";

import { loadSeed } from "./helpers/seed";

test.describe.configure({ mode: "serial" });

test.describe("Tamagochi App", () => {
  // Default to empty state for most tests
  test.beforeEach(async ({ page }) => {
    await loadSeed("empty");
    await page.goto("/tamagochi");
  });

  test("should display the tamagochi app title", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Multiplayer Tamagochi" })).toBeVisible();
  });

  test("should show empty state when no tamagochis", async ({ page }) => {
    await expect(page.getByText("No tamagochis yet! Spawn one to get started.")).toBeVisible();
  });

  test("should spawn a new tamagochi", async ({ page }) => {
    const tamagochiName = "Test Pet";

    // Fill in the name
    await page.getByPlaceholder("Enter a name...").fill(tamagochiName);
    await page.getByRole("button", { name: "Spawn Tamagochi" }).click();

    // Wait for the tamagochi to appear in the active list
    await expect(page.getByText(`Active Tamagochis (1)`)).toBeVisible();
    // Use more specific selector for the name in the active list
    const activeList = page
      .locator('div[class*="rounded-lg bg-white p-4 shadow-md"]')
      .filter({ hasText: "Active Tamagochis" });
    await expect(activeList.getByText(tamagochiName)).toBeVisible();

    // Check that spawn form shows user already has a tamagochi
    await expect(page.getByText("You already have a tamagochi!")).toBeVisible();
  });

  test("should not spawn with empty name", async ({ page }) => {
    // Try to spawn without entering a name
    await page.getByRole("button", { name: "Spawn Tamagochi" }).click();

    // Should show error
    await expect(page.getByText("Please enter a name for your tamagochi")).toBeVisible();

    // Should still show empty state
    await expect(page.getByText("No tamagochis yet! Spawn one to get started.")).toBeVisible();
  });

  test("should display tamagochi stats", async ({ page }) => {
    // Spawn a tamagochi first
    await page.getByPlaceholder("Enter a name...").fill("Statsy");
    await page.getByRole("button", { name: "Spawn Tamagochi" }).click();

    // Wait for stats to appear - use heading to be specific
    await expect(page.getByRole("heading", { name: "Statsy" })).toBeVisible();
    await expect(page.getByText("Status: Alive")).toBeVisible();
    await expect(page.getByText("Hunger")).toBeVisible();
    await expect(page.getByText("Happiness")).toBeVisible();
    await expect(page.getByText("Health")).toBeVisible();
  });

  test("should interact with tamagochi", async ({ page }) => {
    // Spawn a tamagochi first
    await page.getByPlaceholder("Enter a name...").fill("Interactive");
    await page.getByRole("button", { name: "Spawn Tamagochi" }).click();

    // Wait for interaction buttons - use exact match
    await expect(page.getByRole("heading", { name: "Interact", exact: true })).toBeVisible();

    // Test feed button
    const feedButton = page.getByRole("button").filter({ hasText: "Feed" });
    await expect(feedButton).toBeVisible();
    await feedButton.click();

    // Test pet button
    const petButton = page.getByRole("button").filter({ hasText: "Pet" });
    await expect(petButton).toBeVisible();
    await petButton.click();

    // Test heal button
    const healButton = page.getByRole("button").filter({ hasText: "Heal" });
    await expect(healButton).toBeVisible();
    await healButton.click();
  });

  test("should display game canvas", async ({ page }) => {
    // Canvas should be visible even with no tamagochis
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute("width", "1024");
    await expect(canvas).toHaveAttribute("height", "1024");
  });

  test("should show instructions", async ({ page }) => {
    await expect(page.getByText("How to Play:")).toBeVisible();
    await expect(page.getByText("• Spawn your own tamagochi and give it a name")).toBeVisible();
    await expect(page.getByText("• Click on any tamagochi to pet it")).toBeVisible();
  });
});

test.describe("Tamagochi App with existing data", () => {
  test("should display pre-seeded tamagochis", async ({ page }) => {
    // Load sample tamagochis
    await loadSeed("sample-tamagochis");
    await page.goto("/tamagochi");

    // Check that all seeded tamagochis are visible
    await expect(page.getByText("Active Tamagochis (3)")).toBeVisible();
    const activeList = page
      .locator('div[class*="rounded-lg bg-white p-4 shadow-md"]')
      .filter({ hasText: "Active Tamagochis" });
    await expect(activeList.getByText("Fluffy")).toBeVisible();
    await expect(activeList.getByText("Sparkle")).toBeVisible();
    await expect(activeList.getByText("Shadow")).toBeVisible();

    // Canvas should not show empty state
    await expect(page.getByText("No tamagochis yet! Spawn one to get started.")).not.toBeVisible();
  });

  test("should show low stats warning", async ({ page }) => {
    // Load sample tamagochis (Shadow has low stats)
    await loadSeed("sample-tamagochis");
    await page.goto("/tamagochi");

    // Shadow should have red text for low stats
    const shadowItem = page.locator('div[class*="rounded p-2"]').filter({ hasText: "Shadow" });
    await expect(shadowItem.locator('span[class*="text-red-500"]')).toHaveCount(3); // All 3 stats are low
  });

  test("should prevent spawning when user has tamagochi", async ({ page }) => {
    // Load sample tamagochis (user-test-1 has Fluffy)
    await loadSeed("sample-tamagochis");
    await page.goto("/tamagochi");

    // Set user ID after navigating to the page
    await page.evaluate(() => {
      localStorage.setItem("tamagochi-user-id", "user-test-1");
    });

    // Reload page to pick up the localStorage change
    await page.reload();

    // Should show user already has tamagochi
    await expect(page.getByText("You already have a tamagochi!")).toBeVisible();
    await expect(page.getByText("Take care of Fluffy")).toBeVisible();

    // Should show Fluffy's stats
    await expect(page.getByRole("heading", { name: "Fluffy" })).toBeVisible();
  });
});

test.describe("Tamagochi Easter Eggs", () => {
  test.beforeEach(async ({ page }) => {
    await loadSeed("empty");
    await page.goto("/tamagochi");
  });

  test("should create rainbow tamagochi with special name", async ({ page }) => {
    // Spawn a tamagochi with "rainbow" in the name
    await page.getByPlaceholder("Enter a name...").fill("Rainbow");
    await page.getByRole("button", { name: "Spawn Tamagochi" }).click();

    // Wait for it to appear in the active list
    await expect(page.getByText("Active Tamagochis (1)")).toBeVisible();
    // Note: We can't easily test the actual rainbow colors in the canvas
  });

  test("should create golden tamagochi with special name", async ({ page }) => {
    // Spawn a tamagochi with "gold" in the name
    await page.getByPlaceholder("Enter a name...").fill("Golden");
    await page.getByRole("button", { name: "Spawn Tamagochi" }).click();

    // Wait for it to appear in the active list
    await expect(page.getByText("Active Tamagochis (1)")).toBeVisible();
  });
});
