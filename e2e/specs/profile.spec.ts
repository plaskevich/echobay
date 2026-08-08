import { expect, test } from '@playwright/test';

import { PUBLIC_SELLER_LISTING } from '../fixtures/listings';
import { PUBLIC_USER_PROFILE, TEST_USER_PROFILE } from '../fixtures/profiles';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, resetTestProfile } from '../helpers/users';

const SELLER_EMAIL = 'seller-profile@echobay.local';

test.describe('Profile Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('displays profile header with user info', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.getByTestId('profile-header')).toBeVisible();
    await expect(page.getByTestId('profile-username')).toHaveText(TEST_USER_PROFILE.username);
    await expect(page.getByTestId('profile-location')).toContainText(TEST_USER_PROFILE.location);
    await expect(page.getByTestId('profile-about')).toContainText(TEST_USER_PROFILE.about);
    await expect(page.getByTestId('profile-member-since')).toBeVisible();
  });

  test('filters listings by Active status', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByTestId('listings-grid')).toBeVisible();

    await page.getByTestId('status-filter-active').click();

    await expect(page.getByTestId('listings-grid')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Abbey Road' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kind of Blue' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'OK Computer' })).toBeVisible();
  });

  test('Sold filter excludes active-only listings', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByTestId('listings-grid')).toBeVisible();

    await page.getByTestId('status-filter-sold').click();

    await expect(page.getByRole('heading', { name: 'Abbey Road' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kind of Blue' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'OK Computer' })).not.toBeVisible();
  });

  test('navigates to edit profile page', async ({ page }) => {
    await page.goto('/profile');

    await page.getByTestId('edit-profile-button').click();

    await expect(page).toHaveURL('/profile/edit');
  });

  test('listing card navigates to item detail', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByTestId('listings-grid')).toBeVisible();

    await page.getByRole('heading', { name: 'Abbey Road' }).click();

    await expect(page).toHaveURL(/\/items\/.+/);
  });
});

test.describe('Public User Profile', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;

  test.beforeAll(async () => {
    const { user } = await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = user.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...PUBLIC_USER_PROFILE,
    });

    await supabaseAdmin.from('listings').insert([{ ...PUBLIC_SELLER_LISTING, owner_id: sellerId }]);
  });

  test.afterAll(async () => {
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await deleteTestUser(SELLER_EMAIL);
  });

  test('displays public profile info', async ({ page }) => {
    await page.goto(`/users/${sellerId}`);

    await expect(page.getByTestId('profile-username')).toHaveText(PUBLIC_USER_PROFILE.username);
    await expect(page.getByTestId('profile-location')).toContainText(PUBLIC_USER_PROFILE.location);
    await expect(page.getByTestId('profile-about')).toContainText(PUBLIC_USER_PROFILE.about);
  });

  test('shows listings on public profile', async ({ page }) => {
    await page.goto(`/users/${sellerId}`);

    await expect(page.getByTestId('listing-count')).toHaveText('1 item');
    await expect(page.getByRole('heading', { name: 'Revolver' })).toBeVisible();
  });

  test('does not show Edit Profile button for other users', async ({ page }) => {
    await page.goto(`/users/${sellerId}`);
    await expect(page.getByTestId('profile-username')).toBeVisible();

    await expect(page.getByTestId('edit-profile-button')).not.toBeVisible();
  });

  test('shows User not found for invalid user id', async ({ page }) => {
    await page.goto('/users/00000000-0000-0000-0000-000000000000');

    await expect(page.getByText('User not found')).toBeVisible();
  });
});

test.describe('Edit Profile Form', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetTestProfile();
  });

  test.afterAll(async () => {
    await resetTestProfile();
  });

  test('loads current profile data into the form', async ({ page }) => {
    await page.goto('/profile/edit');

    await expect(page.getByTestId('profile-edit-form')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();

    await expect(page.getByTestId('username-input')).toHaveValue(TEST_USER_PROFILE.username);
    await expect(page.getByLabel('Location')).toHaveValue(TEST_USER_PROFILE.location);
    await expect(page.getByTestId('about-input')).toHaveValue(TEST_USER_PROFILE.about);
  });

  test('Cancel button returns to profile without saving', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page.getByTestId('username-input')).toHaveValue(TEST_USER_PROFILE.username);

    await page.getByTestId('username-input').fill('should-not-save');
    await page.getByTestId('cancel-edit-button').click();

    await expect(page).toHaveURL('/profile');
    await expect(page.getByTestId('profile-username')).toHaveText(TEST_USER_PROFILE.username);
  });

  test('updates username successfully', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page.getByTestId('username-input')).toHaveValue(TEST_USER_PROFILE.username);

    await page.getByTestId('username-input').clear();
    await page.getByTestId('username-input').fill('updateduser');
    await page.getByTestId('save-profile-button').click();

    await expect(page).toHaveURL('/profile', { timeout: 5000 });
    await expect(page.getByTestId('profile-username')).toHaveText('updateduser');
  });

  test('updates about field successfully', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page.getByTestId('about-input')).toBeVisible();

    await page.getByTestId('about-input').clear();
    await page.getByTestId('about-input').fill('Updated bio for testing');
    await page.getByTestId('save-profile-button').click();

    await expect(page).toHaveURL('/profile', { timeout: 5000 });
    await expect(page.getByTestId('profile-about')).toContainText('Updated bio for testing');
  });

  test('updates location via autocomplete', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page.getByLabel('Location')).toBeVisible();

    await page.getByLabel('Location').clear();
    await page.getByLabel('Location').pressSequentially('Berli', { delay: 50 });
    await expect(page.getByTestId('location-suggestion-0')).toBeVisible();
    await page.getByTestId('location-suggestion-0').click();

    await expect(page.getByLabel('Location')).toHaveValue(/Berlin/);
    await page.getByTestId('save-profile-button').click();

    await expect(page).toHaveURL('/profile', { timeout: 5000 });
    await expect(page.getByTestId('profile-location')).toContainText('Berlin');
  });
});
