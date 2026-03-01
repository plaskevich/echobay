import { expect, test } from '@playwright/test';

import { createTestUser, deleteTestUser } from '../helpers/supabase';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  const SIGNUP_EMAIL = 'signup-test@echobay.local';

  test.afterAll(async () => {
    await deleteTestUser(SIGNUP_EMAIL);
  });

  test('should toggle between login and signup modes', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByText('Welcome Back')).toBeVisible();
    await page.getByTestId('auth-toggle-button').click();
    await expect(page.getByText('Create Account')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth');

    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password', { exact: true }).fill('wrongpassword');
    await page.getByTestId('auth-submit-button').click();

    await expect(page.getByText('Invalid login credentials')).toBeVisible({ timeout: 5000 });
  });

  test('should log in with valid credentials', async ({ page }) => {
    await createTestUser('login-test@echobay.local', 'TestPassword123!');

    await page.goto('/auth');

    await page.getByLabel('Email').fill('login-test@echobay.local');
    await page.getByLabel('Password', { exact: true }).fill('TestPassword123!');
    await page.getByTestId('auth-submit-button').click();

    await expect(page).toHaveURL('/?page=1', { timeout: 10000 });
  });
});
