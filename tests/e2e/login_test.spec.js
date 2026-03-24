const { test, expect } = require('@playwright/test');

test('generated test: Test Login Page and Auth', async ({ page }) => {
  
  await page.goto('/');
  await page.click('text=Get Started');
  await page.fill('input[placeholder*="ID"]', 'testuser');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Access")');
  await expect(page).toHaveURL(/.*login|.*dashboard/);
  
});
