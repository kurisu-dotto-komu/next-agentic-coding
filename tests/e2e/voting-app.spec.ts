import { expect, test } from "@playwright/test";

import { loadSeed } from "../helpers/seed";

test.describe("Voting App", () => {
  test.beforeEach(async () => {
    await loadSeed("empty");
  });

  test("mobile users can vote by holding buttons", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.getByTestId("user-avatar")).toBeVisible();
    await expect(page.getByTestId("vote-button-O")).toBeVisible();
    await expect(page.getByTestId("vote-button-X")).toBeVisible();

    const oButton = page.getByTestId("vote-button-O");
    await oButton.dispatchEvent("mousedown");

    await expect(page.getByTestId("vote-indicator-O")).toBeVisible();

    await oButton.dispatchEvent("mouseup");
    await expect(page.getByTestId("vote-indicator-O")).not.toBeVisible();
  });

  test("desktop shows all users and real-time votes", async ({ page, context }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    await expect(page.getByTestId("qr-code")).toBeVisible();
    await expect(page.getByTestId("vote-bar")).toBeVisible();

    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto("/");

    await mobilePage.waitForTimeout(1000);

    const xButton = mobilePage.getByTestId("vote-button-X");
    await xButton.dispatchEvent("mousedown");

    await page.waitForTimeout(500);
    await expect(page.getByTestId("user-vote-X").first()).toBeVisible();

    await xButton.dispatchEvent("mouseup");
    await page.waitForTimeout(500);

    const voteIndicators = await page.locator('[data-testid="user-vote-X"]').count();
    expect(voteIndicators).toBe(0);
  });

  test("users persist across refreshes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await page.waitForTimeout(1000);

    const avatarSrc1 = await page.getByTestId("user-avatar").getAttribute("src");
    expect(avatarSrc1).toBeTruthy();

    await page.reload();

    await page.waitForTimeout(1000);

    const avatarSrc2 = await page.getByTestId("user-avatar").getAttribute("src");
    expect(avatarSrc1).toBe(avatarSrc2);
  });

  test("vote proportions update correctly", async ({ page, context }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    const voteBar = page.getByTestId("vote-bar");
    await expect(voteBar).toBeVisible();
    await expect(voteBar).toContainText("Total participants: 0");

    const mobile1 = await context.newPage();
    await mobile1.setViewportSize({ width: 375, height: 667 });
    await mobile1.goto("/");
    await mobile1.waitForTimeout(1000);

    await expect(voteBar).toContainText("Total participants: 1");

    const oButton = mobile1.getByTestId("vote-button-O");
    await oButton.dispatchEvent("mousedown");
    await page.waitForTimeout(500);

    await expect(voteBar).toContainText("O: 1");
    await expect(voteBar).toContainText("X: 0");
    await expect(voteBar).toContainText("Not voting: 0");
  });

  test("multiple users can vote simultaneously", async ({ context }) => {
    const desktop = await context.newPage();
    await desktop.setViewportSize({ width: 1920, height: 1080 });
    await desktop.goto("/");

    const voters = [];
    for (let i = 0; i < 3; i++) {
      const mobile = await context.newPage();
      await mobile.setViewportSize({ width: 375, height: 667 });
      await mobile.goto("/");
      voters.push(mobile);
    }

    await desktop.waitForTimeout(2000);

    await voters[0].getByTestId("vote-button-O").dispatchEvent("mousedown");
    await voters[1].getByTestId("vote-button-X").dispatchEvent("mousedown");
    await voters[2].getByTestId("vote-button-O").dispatchEvent("mousedown");

    await desktop.waitForTimeout(1000);

    const voteBar = desktop.getByTestId("vote-bar");
    await expect(voteBar).toContainText("Total participants: 3");
    await expect(voteBar).toContainText("O: 2");
    await expect(voteBar).toContainText("X: 1");

    for (const voter of voters) {
      await voter.close();
    }
  });
});
