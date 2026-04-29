import { test, expect } from '@playwright/test';

test('login page has 3d animation canvas', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // LoginBackground componenti içinde canvas oluşturulmalı
  const canvas = page.locator('#webgl-container canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });
  
  // Boyutlarının 0'dan büyük olduğunu kontrol et
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
});
