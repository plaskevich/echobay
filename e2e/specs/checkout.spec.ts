import { expect, test } from '@playwright/test';

import { CHECKOUT_SELLER_EMAIL, SHIPPING_DATA, fillShippingForm } from '../fixtures/checkout';
import { CHECKOUT_LISTING, FREE_SHIPPING_LISTING } from '../fixtures/listings';
import { CHECKOUT_SELLER_PROFILE } from '../fixtures/profiles';
import { setupStripeMock } from '../helpers/stripe';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, TEST_USER_EMAIL } from '../helpers/users';

test.describe('Checkout', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;
  let listingId: string;
  let freeShippingListingId: string;

  test.beforeAll(async () => {
    const { user: seller } = await createTestUser(CHECKOUT_SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = seller.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...CHECKOUT_SELLER_PROFILE,
    });

    const {
      data: { users },
    } = await supabaseAdmin.auth.admin.listUsers();
    const testUserId = users!.find((u) => u.email === TEST_USER_EMAIL)!.id;

    const { data: listings } = await supabaseAdmin
      .from('listings')
      .insert([
        { ...CHECKOUT_LISTING, owner_id: sellerId },
        { ...FREE_SHIPPING_LISTING, owner_id: sellerId },
      ])
      .select('id');

    listingId = listings![0].id;
    freeShippingListingId = listings![1].id;

    await supabaseAdmin.from('profiles').update({ shipping_address: null }).eq('id', testUserId);
  });

  test.afterAll(async () => {
    await supabaseAdmin
      .from('messages')
      .delete()
      .in(
        'chat_id',
        (await supabaseAdmin.from('chats').select('id').in('listing_id', [listingId, freeShippingListingId])).data?.map(
          (c) => c.id
        ) || []
      );
    await supabaseAdmin.from('chats').delete().in('listing_id', [listingId, freeShippingListingId]);
    await supabaseAdmin.from('orders').delete().in('listing_id', [listingId, freeShippingListingId]);
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await deleteTestUser(CHECKOUT_SELLER_EMAIL);
  });

  test.describe('Shipping Form', () => {
    test('shows validation errors for empty required fields', async ({ page }) => {
      await page.goto(`/checkout/${listingId}`);
      await expect(page.getByTestId('shipping-form-title')).toBeVisible();

      await page.getByTestId('shipping-submit-button').click();

      await expect(page.getByTestId('shipping-error-fullname')).toBeVisible();
      await expect(page.getByTestId('shipping-error-address1')).toBeVisible();
      await expect(page.getByTestId('shipping-error-city')).toBeVisible();
      await expect(page.getByTestId('shipping-error-postalcode')).toBeVisible();
      await expect(page.getByTestId('shipping-error-country')).toBeVisible();
      await expect(page.getByTestId('shipping-error-phone')).toBeVisible();
    });

    test('clears validation error when field is filled', async ({ page }) => {
      await page.goto(`/checkout/${listingId}`);

      await page.getByTestId('shipping-submit-button').click();
      await expect(page.getByTestId('shipping-error-fullname')).toBeVisible();

      await page.getByTestId('shipping-fullname-input').fill('Test User');
      await expect(page.getByTestId('shipping-error-fullname')).not.toBeVisible();
    });

    test('advances to payment step when form is valid', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);

      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();

      await expect(page.getByTestId('payment-form-title')).toBeVisible();
    });
  });

  test.describe('Payment Step', () => {
    test('displays correct total amount (item + shipping)', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);
      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();

      await expect(page.getByTestId('payment-form-title')).toBeVisible();
      await expect(page.getByTestId('payment-total-amount')).toHaveText('€50.00');
    });

    test('back button returns to shipping with preserved data', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);
      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();
      await expect(page.getByTestId('payment-form-title')).toBeVisible();

      await page.getByTestId('payment-back-button').click();

      await expect(page.getByTestId('shipping-form-title')).toBeVisible();
      await expect(page.getByTestId('shipping-fullname-input')).toHaveValue(SHIPPING_DATA.fullName);
      await expect(page.getByTestId('shipping-address1-input')).toHaveValue(SHIPPING_DATA.addressLine1);
      await expect(page.getByTestId('shipping-city-input')).toHaveValue(SHIPPING_DATA.city);
      await expect(page.getByTestId('shipping-postalcode-input')).toHaveValue(SHIPPING_DATA.postalCode);
    });
  });

  test.describe('Order Summary', () => {
    test('displays item details, shipping address, and price breakdown', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);

      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();
      await page.getByTestId('payment-submit-button').click();

      await expect(page.getByTestId('summary-title')).toBeVisible();

      await expect(page.getByTestId('summary-item-artist')).toHaveText('Pink Floyd');
      await expect(page.getByTestId('summary-item-title')).toHaveText('The Dark Side of the Moon');
      await expect(page.getByTestId('summary-item-price')).toHaveText('€45.00');

      await expect(page.getByTestId('summary-shipping-address')).toContainText(SHIPPING_DATA.fullName);
      await expect(page.getByTestId('summary-shipping-address')).toContainText(SHIPPING_DATA.addressLine1);
      await expect(page.getByTestId('summary-shipping-address')).toContainText(SHIPPING_DATA.addressLine2);

      await expect(page.getByTestId('summary-payment-method')).toContainText('Credit Card');

      await expect(page.getByTestId('summary-price-item')).toHaveText('€45.00');
      await expect(page.getByTestId('summary-price-shipping')).toHaveText('€5.00');
      await expect(page.getByTestId('summary-total')).toHaveText('€50.00');
    });

    test('back button returns to payment step', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);
      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();
      await page.getByTestId('payment-submit-button').click();
      await expect(page.getByTestId('summary-title')).toBeVisible();

      await page.getByTestId('summary-back-button').click();

      await expect(page.getByTestId('payment-form-title')).toBeVisible();
    });

    test('shows free shipping label when shipping is zero', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${freeShippingListingId}`);

      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();
      await page.getByTestId('payment-submit-button').click();

      await expect(page.getByTestId('summary-title')).toBeVisible();
      await expect(page.getByTestId('summary-price-shipping')).toHaveText('Free');
      await expect(page.getByTestId('summary-total')).toHaveText('€20.00');
    });
  });

  test.describe('Order Confirmation', () => {
    test('completes full checkout and shows confirmation', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);

      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();
      await page.getByTestId('payment-submit-button').click();
      await expect(page.getByTestId('summary-title')).toBeVisible();

      await page.getByTestId('summary-confirm-button').click();

      await expect(page.getByTestId('order-confirmed-title')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('order-confirmed-message')).toBeVisible();
      await expect(page.getByTestId('order-confirmed-continue')).toBeVisible();
    });

    test('continue shopping navigates to home page', async ({ page }) => {
      await setupStripeMock(page);
      await page.goto(`/checkout/${listingId}`);

      await fillShippingForm(page);
      await page.getByTestId('shipping-submit-button').click();
      await page.getByTestId('payment-submit-button').click();
      await page.getByTestId('summary-confirm-button').click();
      await expect(page.getByTestId('order-confirmed-title')).toBeVisible({ timeout: 10000 });

      await page.getByTestId('order-confirmed-continue').click();

      await expect(page).toHaveURL('/?page=1');
    });
  });
});
