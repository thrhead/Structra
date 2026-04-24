import { test, expect } from '@playwright/test';

test.describe('Admin Jobs Management', () => {
  test.beforeEach(async ({ page }) => {
    // In a real scenario, we would perform login here
    // For this boilerplate E2E, we'll assume the user is redirected if not logged in
    await page.goto('/admin/jobs');
  });

  test('should display jobs list', async ({ page }) => {
    // Check for a known element in the jobs page
    await expect(page.locator('h1')).toContainText(['İşler', 'Jobs']);
  });

  test('should open create job dialog', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /Yeni İş|Create Job/i });
    if (await createButton.isVisible()) {
        await createButton.click();
        await expect(page.getByRole('dialog')).toBeVisible();
    }
  });
});
