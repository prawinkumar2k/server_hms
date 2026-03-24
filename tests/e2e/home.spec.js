const { test, expect } = require('@playwright/test');

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  // Matches <title> in index.html
  await expect(page).toHaveTitle(/HMS Dashboard/);
  // Matches the H1 in Landing.jsx
  await expect(page.getByText(/A Unified Platform for/i)).toBeVisible();
});

test('can navigate to login page', async ({ page }) => {
  await page.goto('/');
  // Click the "Get Started" button in the navbar
  await page.click('text=Get Started');
  // Should redirect to login
  await expect(page).toHaveURL(/.*login/);
});
