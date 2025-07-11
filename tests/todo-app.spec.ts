import { expect, test } from "@playwright/test";

import { loadSeed } from "./helpers/seed";

test.describe.configure({ mode: "serial" });

test.describe("Todo App", () => {
  // Default to empty state for most tests
  test.beforeEach(async ({ page }) => {
    await loadSeed("empty");
    await page.goto("/todo");
  });

  test("should display the todo app title", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Todo List" })).toBeVisible();
  });

  test("should add a new todo", async ({ page }) => {
    const todoText = "Test todo item";

    await page.getByPlaceholder("Add a new todo...").fill(todoText);
    await page.getByRole("button", { name: "Add" }).click();

    await expect(page.getByText(todoText)).toBeVisible();
  });

  test("should toggle todo completion", async ({ page }) => {
    const todoText = "Toggle test todo";

    // Add a todo
    await page.getByPlaceholder("Add a new todo...").fill(todoText);
    await page.getByRole("button", { name: "Add" }).click();

    // Wait for the todo to appear
    const todoItem = page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();

    // Toggle completion
    const checkbox = todoItem.getByRole("checkbox");
    await checkbox.click();

    // Check if text has line-through style
    const todoSpan = todoItem.locator("span").filter({ hasText: todoText });
    await expect(todoSpan).toHaveClass(/line-through/);

    // Toggle back
    await checkbox.click();
    await expect(todoSpan).not.toHaveClass(/line-through/);
  });

  test("should delete a todo", async ({ page }) => {
    const todoText = "Delete test todo";

    // Add a todo
    await page.getByPlaceholder("Add a new todo...").fill(todoText);
    await page.getByRole("button", { name: "Add" }).click();

    // Wait for the todo to appear
    const todoItem = page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .filter({ hasText: todoText });
    await expect(todoItem).toBeVisible();

    // Delete it
    const deleteButton = todoItem.getByRole("button", { name: "Delete" });
    await deleteButton.click();

    // Verify it's gone
    await expect(page.getByText(todoText)).not.toBeVisible();
  });

  test("should show empty state when no todos", async ({ page }) => {
    await expect(page.getByText("No todos yet. Add one above!")).toBeVisible();
  });

  test("should not add empty todo", async ({ page }) => {
    // Count initial todos (should be 0 after cleanup)
    const initialCount = await page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .count();

    // Try to add empty todo
    await page.getByPlaceholder("Add a new todo...").fill("");
    await page.getByRole("button", { name: "Add" }).click();

    // Small wait to ensure no network request is made
    await page.waitForTimeout(500);

    // Add a todo with spaces only
    await page.getByPlaceholder("Add a new todo...").fill("   ");
    await page.getByRole("button", { name: "Add" }).click();

    // Small wait to ensure no network request is made
    await page.waitForTimeout(500);

    // Count should remain the same
    const finalCount = await page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .count();
    expect(finalCount).toBe(initialCount);

    // If initial count was 0, we should see empty state
    if (initialCount === 0) {
      await expect(page.getByText("No todos yet. Add one above!")).toBeVisible();
    }
  });

  test("should handle multiple todos", async ({ page }) => {
    const todos = ["First todo", "Second todo", "Third todo"];

    // Add multiple todos
    for (const todo of todos) {
      await page.getByPlaceholder("Add a new todo...").fill(todo);
      await page.getByRole("button", { name: "Add" }).click();
      // Wait for the todo to appear before adding the next
      await expect(page.getByText(todo)).toBeVisible();
    }

    // Verify all are still visible
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible();
    }
  });
});

test.describe("Todo App with default seed", () => {
  test("should display default welcome todos", async ({ page }) => {
    // Load the default seed
    await loadSeed("seed");
    await page.goto("/todo");

    // Check all welcome todos are visible
    await expect(page.getByText("Welcome to your Todo App! 🎉")).toBeVisible();
    await expect(page.getByText("Try adding a new todo above")).toBeVisible();
    await expect(page.getByText("Click the checkbox to mark as complete")).toBeVisible();
    await expect(page.getByText("Click delete to remove a todo")).toBeVisible();
    await expect(page.getByText("All changes sync in real-time! ⚡")).toBeVisible();

    // Check that the third item is marked as complete
    const completedItem = page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .filter({ hasText: "Click the checkbox to mark as complete" });
    await expect(completedItem.getByRole("checkbox")).toBeChecked();

    // Check that others are not completed
    const welcomeItem = page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .filter({ hasText: "Welcome to your Todo App! 🎉" });
    await expect(welcomeItem.getByRole("checkbox")).not.toBeChecked();
  });
});

test.describe("Todo App with existing data", () => {
  test("should display pre-seeded todos", async ({ page }) => {
    // Load sample todos
    await loadSeed("sample-todos");
    await page.goto("/todo");

    // Check that all seeded todos are visible
    await expect(page.getByText("Buy groceries")).toBeVisible();
    await expect(page.getByText("Walk the dog")).toBeVisible();
    await expect(page.getByText("Write tests")).toBeVisible();
    await expect(page.getByText("Review PRs")).toBeVisible();
    await expect(page.getByText("Deploy to production")).toBeVisible();

    // Check completed state
    const walkDogItem = page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .filter({ hasText: "Walk the dog" });
    await expect(walkDogItem.getByRole("checkbox")).toBeChecked();

    const deployItem = page
      .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
      .filter({ hasText: "Deploy to production" });
    await expect(deployItem.getByRole("checkbox")).toBeChecked();
  });

  test("should work with all completed todos", async ({ page }) => {
    // Load all completed todos
    await loadSeed("all-completed");
    await page.goto("/todo");

    // Check that all todos are visible and completed
    const todos = ["Finish project", "Submit report", "Clean workspace"];

    for (const todo of todos) {
      const todoItem = page
        .locator('div[class*="flex items-center gap-2 rounded-lg border"]')
        .filter({ hasText: todo });
      await expect(todoItem).toBeVisible();

      const checkbox = todoItem.getByRole("checkbox");
      await expect(checkbox).toBeChecked();
    }
  });
});
