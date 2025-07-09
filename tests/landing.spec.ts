import { test, expect } from "@playwright/test";
import { ROUTES } from "./test-helpers";

test("Home page redirects to vote page", async ({ page }) => {
  await page.goto(ROUTES.home);

  // Check that we've been redirected to the vote page
  await expect(page).toHaveURL(/\/vote$/);

  // Verify we're on the vote page by checking for voting-specific content
  await expect(page.locator("body")).toContainText(/Real-time Voting|Loading/);
});
