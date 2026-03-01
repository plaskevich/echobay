import { expect, test as setup } from '@playwright/test';

import { createTestUser } from '../helpers/supabase';

const TEST_USER_EMAIL = 'test@echobay.local';
const TEST_USER_PASSWORD = 'TestPassword123!';

setup('authenticate', async ({ page }) => {
  await createTestUser(TEST_USER_EMAIL, TEST_USER_PASSWORD);

  await page.goto('/auth');

  await page.getByLabel('Email').fill(TEST_USER_EMAIL);
  await page.getByLabel('Password', { exact: true }).fill(TEST_USER_PASSWORD);

  await page.getByTestId('auth-submit-button').click();
  await expect(page).toHaveURL('/?page=1', { timeout: 10000 });
  await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
