import { type Page, test } from "@playwright/test";

import { loadSeed } from "./helpers/seed";

async function takeScreenshot(
  page: Page,
  path: string,
  name: string,
  colorScheme: "light" | "dark" = "light",
) {
  // Set color scheme
  await page.emulateMedia({ colorScheme });

  await page.goto(path);
  await page.waitForLoadState("networkidle");

  const suffix = colorScheme === "dark" ? "-dark" : "";
  await page.screenshot({
    path: `tests/screenshots/${name}${suffix}.png`,
    fullPage: true,
  });
}

test.describe("Screenshots: Todo App", () => {
  test("Empty State", async ({ page }) => {
    // Load empty seed to ensure clean state
    await loadSeed("empty");
    await takeScreenshot(page, "/", "todo-empty");
  });

  test("Mixed Todos State", async ({ page }) => {
    // Load sample todos with mix of completed and uncompleted
    await loadSeed("sample-todos");
    await takeScreenshot(page, "/", "todo-mixed");
  });

  test("Default Welcome State", async ({ page }) => {
    // Load default seed with welcome messages
    await loadSeed("seed");
    await takeScreenshot(page, "/", "todo-welcome");
  });
});
