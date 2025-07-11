import { test, expect } from "@playwright/test";
import { ROUTES } from "./test-helpers";

test("Home page has Coffee Quest title", async ({ page }) => {
  await page.goto(ROUTES.home);

  await expect(page.locator("body")).toContainText("Coffee Quest");
});
