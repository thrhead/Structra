import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
	test("should show login page", async ({ page }) => {
		await page.goto("/");
		// Adjust selector based on actual UI
		await expect(page.locator("text=Structra").first()).toBeVisible();
	});
});
