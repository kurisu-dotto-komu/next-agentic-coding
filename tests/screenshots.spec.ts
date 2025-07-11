import { type Page, test } from "@playwright/test";

async function takeScreenshot(page: Page, path: string, name: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: `tests/screenshots/${name}.png`,
    fullPage: true,
  });
}

test.describe("Screenshots: Homepage", () => {
  test("Home Page", async ({ page }) => {
    await takeScreenshot(page, "/", "home");
  });
});
