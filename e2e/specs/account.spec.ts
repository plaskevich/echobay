import { expect, test } from '@playwright/test';

import { ACCOUNT_BOUGHT_LISTING, ACCOUNT_FAVORITE_LISTING, ACCOUNT_SOLD_LISTING } from '../fixtures/listings';
import { ACCOUNT_SELLER_PROFILE } from '../fixtures/profiles';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, getTestUserId } from '../helpers/users';

const SELLER_EMAIL = 'seller-account@echobay.local';

test.describe('Account Pages', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;
  let testUserId: string;
  let boughtListingId: string;
  let soldListingId: string;
  let favoriteListingId: string;

  test.beforeAll(async () => {
    testUserId = await getTestUserId();

    const { user } = await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = user.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...ACCOUNT_SELLER_PROFILE,
    });

    const { data: boughtListing } = await supabaseAdmin
      .from('listings')
      .insert({ ...ACCOUNT_BOUGHT_LISTING, owner_id: sellerId })
      .select('id')
      .single();
    boughtListingId = boughtListing!.id;

    const { data: soldListing } = await supabaseAdmin
      .from('listings')
      .insert({ ...ACCOUNT_SOLD_LISTING, owner_id: testUserId })
      .select('id')
      .single();
    soldListingId = soldListing!.id;

    const { data: favListing } = await supabaseAdmin
      .from('listings')
      .insert({ ...ACCOUNT_FAVORITE_LISTING, owner_id: sellerId })
      .select('id')
      .single();
    favoriteListingId = favListing!.id;

    const testShippingAddress = {
      fullName: 'Test Buyer',
      addressLine1: '123 Test Street',
      city: 'Test City',
      postalCode: '12345',
      country: 'DE',
      state: '',
      phone: '+491234567890',
    };

    await supabaseAdmin.from('orders').insert({
      listing_id: boughtListingId,
      buyer_id: testUserId,
      amount: ACCOUNT_BOUGHT_LISTING.price + ACCOUNT_BOUGHT_LISTING.shipping_price,
      stripe_payment_intent_id: 'pi_test_bought',
      status: 'paid',
      shipping_address: testShippingAddress,
    });

    await supabaseAdmin.from('orders').insert({
      listing_id: soldListingId,
      buyer_id: sellerId,
      amount: ACCOUNT_SOLD_LISTING.price + ACCOUNT_SOLD_LISTING.shipping_price,
      stripe_payment_intent_id: 'pi_test_sold',
      status: 'shipped',
      shipping_address: testShippingAddress,
    });

    await supabaseAdmin.from('favorites').insert({
      user_id: testUserId,
      listing_id: favoriteListingId,
    });
  });

  test.afterAll(async () => {
    await supabaseAdmin.from('favorites').delete().eq('user_id', testUserId).eq('listing_id', favoriteListingId);
    await supabaseAdmin.from('orders').delete().eq('listing_id', boughtListingId);
    await supabaseAdmin.from('orders').delete().eq('listing_id', soldListingId);
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await supabaseAdmin.from('listings').delete().eq('id', soldListingId);
    await deleteTestUser(SELLER_EMAIL);
  });

  test.describe('Settings', () => {
    test('shows email settings by default', async ({ page }) => {
      await page.goto('/settings');

      await expect(page.getByTestId('settings-section-email')).toBeVisible();
      await expect(page.getByTestId('email-settings')).toBeVisible();
      await expect(page.getByText('Change Email Address')).toBeVisible();
    });

    test('navigates to password settings', async ({ page }) => {
      await page.goto('/settings');

      await page.getByTestId('settings-section-password').click();

      await expect(page.getByTestId('password-settings')).toBeVisible();
      await expect(page.getByText('Change Password')).toBeVisible();
    });

    test('navigates to shipping settings', async ({ page }) => {
      await page.goto('/settings');

      await page.getByTestId('settings-section-shipping').click();

      await expect(page.getByTestId('shipping-settings')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Shipping Address' })).toBeVisible();
    });

    test('navigates to theme settings', async ({ page }) => {
      await page.goto('/settings');

      await page.getByTestId('settings-section-theme').click();

      await expect(page.getByTestId('theme-settings')).toBeVisible();
      await expect(page.getByTestId('theme-card-light')).toBeVisible();
      await expect(page.getByTestId('theme-card-dark')).toBeVisible();
    });

    test('switches theme to dark and back', async ({ page }) => {
      await page.goto('/settings');

      await page.getByTestId('settings-section-theme').click();
      await expect(page.getByTestId('theme-settings')).toBeVisible();

      await page.getByTestId('theme-card-dark').click();
      await expect(page.getByTestId('theme-card-dark')).toHaveCSS('border-color', /./);

      await page.getByTestId('theme-card-light').click();
      await expect(page.getByTestId('theme-card-light')).toHaveCSS('border-color', /./);
    });
  });

  test.describe('Orders', () => {
    test('displays bought order details', async ({ page }) => {
      await page.goto('/orders');

      await expect(page.getByTestId('order-card').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('order-title')).toHaveText(ACCOUNT_BOUGHT_LISTING.title);
      await expect(
        page.getByText(`€${(ACCOUNT_BOUGHT_LISTING.price + ACCOUNT_BOUGHT_LISTING.shipping_price).toFixed(2)}`)
      ).toBeVisible();
      await expect(page.getByTestId('order-status')).toHaveText('paid');
    });

    test('switches to sold orders', async ({ page }) => {
      await page.goto('/orders');

      await expect(page.getByTestId('order-card').first()).toBeVisible({ timeout: 10000 });
      await page.getByTestId('orders-filter-sold').click();

      await expect(page.getByTestId('order-title')).toHaveText(ACCOUNT_SOLD_LISTING.title);
      await expect(page.getByTestId('order-status')).toHaveText('shipped');
    });

    test('order card links to listing message', async ({ page }) => {
      await page.goto('/orders');

      await expect(page.getByTestId('order-card').first()).toBeVisible({ timeout: 10000 });
      await page.getByTestId('order-card').click();

      await expect(page).toHaveURL(/\/messages\?listingId=.+/);
    });
  });

  test.describe('Favorites', () => {
    test('displays favorited listing', async ({ page }) => {
      await page.goto('/favorites');

      await expect(page.getByTestId('favorites-grid')).toBeVisible();
      await expect(page.getByTestId('listing-card')).toBeVisible();
      await expect(page.getByRole('heading', { name: ACCOUNT_FAVORITE_LISTING.title })).toBeVisible();
    });

    test('can unfavorite a listing', async ({ page }) => {
      await page.goto('/favorites');

      await expect(page.getByTestId('listing-card')).toBeVisible();

      await page.getByLabel('Remove from favorites').click();

      await expect(page.getByTestId('favorites-empty')).toBeVisible();
      await expect(page.getByText('No favorites yet')).toBeVisible();
    });
  });
});
