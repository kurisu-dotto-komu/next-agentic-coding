import { test } from "@playwright/test";
import { ROUTES, SCREENSHOT_DIR } from "./test-helpers";

test.describe("Screenshot all routes", () => {
  for (const [routeName, routePath] of Object.entries(ROUTES)) {
    test(`screenshot ${routeName} page`, async ({ page }) => {
      await page.goto(routePath);

      // Wait for the page to be fully loaded
      await page.waitForLoadState("networkidle");

      // Additional wait for dynamic content
      await page.waitForTimeout(1000);

      // Take a full page screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${routeName}-full.png`,
        fullPage: true,
      });

      // Take viewport screenshot too
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${routeName}-viewport.png`,
        fullPage: false,
      });
    });
  }
});
