import { test, expect } from "@playwright/test";
import { ROUTES } from "./test-helpers";

test("Home page has Get Started text", async ({ page }) => {
  await page.goto(ROUTES.home);

  await expect(page.locator("body")).toContainText("Get started");
});
