import { expect, test } from "@playwright/test";

test.describe("Landing Page - Voting App", () => {
  test("desktop view shows correct elements", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Live Voting Session" })).toBeVisible();
    await expect(page.getByTestId("qr-code")).toBeVisible();
    await expect(page.getByTestId("vote-bar")).toBeVisible();
    await expect(page.getByText("Waiting for participants to join...")).toBeVisible();
  });

  test("mobile view shows voting interface", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.getByTestId("user-avatar")).toBeVisible();
    await expect(page.getByTestId("vote-button-O")).toBeVisible();
    await expect(page.getByTestId("vote-button-X")).toBeVisible();
    await expect(page.getByText("Hold a button to vote!")).toBeVisible();
  });

  test("responsive behavior works correctly", async ({ page }) => {
    await page.goto("/");

    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByTestId("qr-code")).toBeVisible();
    await expect(page.getByTestId("vote-button-O")).not.toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId("qr-code")).not.toBeVisible();
    await expect(page.getByTestId("vote-button-O")).toBeVisible();
  });

  test("vote buttons have proper styling", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const oButton = page.getByTestId("vote-button-O");
    const xButton = page.getByTestId("vote-button-X");

    await expect(oButton.locator("div").first()).toHaveClass(/bg-green-500/);
    await expect(xButton.locator("div").first()).toHaveClass(/bg-red-500/);
  });

  test("QR code is positioned correctly", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    const qrCode = page.getByTestId("qr-code");
    await expect(qrCode).toHaveClass(/fixed/);
    await expect(qrCode).toHaveClass(/right-4/);
    await expect(qrCode).toHaveClass(/top-4/);
  });
});
