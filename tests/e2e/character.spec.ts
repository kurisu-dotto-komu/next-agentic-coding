import { test, expect } from "@playwright/test";
import { ROUTES } from "../test-helpers";

test("character creation flow", async ({ page }) => {
  await page.goto(ROUTES.home);

  // Click Play Now button
  await page.getByRole("link", { name: "Play Now" }).click();

  // Should redirect to character creation
  await expect(page).toHaveURL(/\/character/);

  // Check that character creation form is visible
  await expect(page.getByText("Create Your Barista")).toBeVisible();

  // Check avatar is displayed - the avatar SVG has specific dimensions
  await expect(page.locator('svg[width="120"][height="120"]')).toBeVisible(); // DiceBear generates SVG avatars

  // Can randomize avatar
  await page.getByRole("button", { name: "Randomize Avatar" }).click();

  // Fill character form
  await page.getByPlaceholder("Enter your barista name").fill("TestBarista");

  // Check coffee preferences are visible
  await expect(page.getByText("Coffee Preferences")).toBeVisible();
  await expect(page.getByLabel("Coffee Strength")).toBeVisible();
  await expect(page.getByLabel("Sweetness Level")).toBeVisible();
  await expect(page.getByLabel("Milk Preference")).toBeVisible();

  // Create button should be enabled when name is filled
  const createButton = page.getByRole("button", { name: "Create Character" });
  await expect(createButton).toBeEnabled();
});

test("landing page has correct elements", async ({ page }) => {
  await page.goto(ROUTES.home);

  // Check title
  await expect(page.getByText("☕ Coffee Quest")).toBeVisible();

  // Check tagline
  await expect(
    page.getByText(/Join the ultimate collaborative coffee experience/),
  ).toBeVisible();

  // Check play button
  await expect(page.getByRole("link", { name: "Play Now" })).toBeVisible();

  // Check features
  await expect(page.getByText("🎮 Real-time multiplayer")).toBeVisible();
  await expect(page.getByText("🎨 Custom avatars")).toBeVisible();
  await expect(page.getByText("☕ Mini-games")).toBeVisible();
});
