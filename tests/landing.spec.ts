import { expect, test } from "@playwright/test";

test("Home page has Get Started text", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).toContainText("Get started");
});
