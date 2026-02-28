import { expect, test } from '@playwright/test';

import { RATING_LISTING } from '../fixtures/listings';
import { RATING_SELLER_PROFILE } from '../fixtures/profiles';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, TEST_USER_EMAIL } from '../helpers/users';

const SELLER_EMAIL = 'rating-seller@echobay.local';

test.describe('Ratings', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;
  let buyerId: string;
  let listingId: string;
  let orderId: string;
  let chatId: string;

  test.beforeAll(async () => {
    const { user: seller } = await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = seller.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...RATING_SELLER_PROFILE,
    });

    const {
      data: { users },
    } = await supabaseAdmin.auth.admin.listUsers();
    buyerId = users!.find((u) => u.email === TEST_USER_EMAIL)!.id;

    const { data: listings } = await supabaseAdmin
      .from('listings')
      .insert([{ ...RATING_LISTING, owner_id: sellerId }])
      .select('id');
    listingId = listings![0].id;

    const { data: order } = await supabaseAdmin
      .from('orders')
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        amount: RATING_LISTING.price + RATING_LISTING.shipping_price,
        shipping_address: {
          fullName: 'Test Buyer',
          addressLine1: '123 Test Street',
          city: 'Berlin',
          state: '',
          postalCode: '10115',
          country: 'DE',
          phone: '+49 30 12345678',
        },
        status: 'delivered',
        stripe_payment_intent_id: `pi_rating_test_${Date.now()}`,
      })
      .select('id')
      .single();
    orderId = order!.id;

    const { data: chat } = await supabaseAdmin
      .from('chats')
      .insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        listing_id: listingId,
        order_id: orderId,
      })
      .select('id')
      .single();
    chatId = chat!.id;

    await supabaseAdmin.from('messages').insert({
      chat_id: chatId,
      sender_id: buyerId,
      content: 'Item has been received',
      type: 'system',
      metadata: {
        event: 'delivered',
        order_id: orderId,
        listing_title: RATING_LISTING.title,
      },
    });
  });

  test.afterAll(async () => {
    await supabaseAdmin.from('ratings').delete().eq('order_id', orderId);
    await supabaseAdmin.from('messages').delete().eq('chat_id', chatId);
    await supabaseAdmin.from('chats').delete().eq('id', chatId);
    await supabaseAdmin.from('orders').delete().eq('id', orderId);
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await deleteTestUser(SELLER_EMAIL);
  });

  test.describe('No Ratings', () => {
    test('shows "No ratings yet" on item detail seller card', async ({ page }) => {
      await page.goto(`/items/${listingId}`);

      await expect(page.getByTestId('seller-card')).toBeVisible();
      await expect(page.getByTestId('no-ratings')).toBeVisible();
      await expect(page.getByTestId('no-ratings')).toHaveText('No ratings yet');
    });

    test('shows "No ratings yet" on seller profile page', async ({ page }) => {
      await page.goto(`/users/${sellerId}`);

      await expect(page.getByTestId('profile-header')).toBeVisible();
      await expect(page.getByTestId('no-ratings')).toBeVisible();
      await expect(page.getByTestId('no-ratings')).toHaveText('No ratings yet');
    });
  });

  test.describe('Rating Widget', () => {
    test('shows rating widget in delivered system message for buyer', async ({ page }) => {
      await page.goto(`/messages?chatId=${chatId}`);

      await expect(page.getByTestId('system-message')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('system-message-title').filter({ hasText: 'Item Received' })).toBeVisible();
      await expect(page.getByTestId('rating-widget')).toBeVisible();
    });

    test('submit button appears after selecting stars', async ({ page }) => {
      await page.goto(`/messages?chatId=${chatId}`);

      await expect(page.getByTestId('rating-widget')).toBeVisible({ timeout: 10000 });

      const ratingWidget = page.getByTestId('rating-widget');
      const stars = ratingWidget.locator('.rr--box');
      await stars.nth(3).click();

      await expect(page.getByTestId('rating-submit-button')).toBeVisible();
    });

    test('submitting a rating shows the submitted state', async ({ page }) => {
      await page.goto(`/messages?chatId=${chatId}`);

      await expect(page.getByTestId('rating-widget')).toBeVisible({ timeout: 10000 });

      const ratingWidget = page.getByTestId('rating-widget');
      const stars = ratingWidget.locator('.rr--box');
      await stars.nth(3).click();

      await page.getByTestId('rating-submit-button').click();

      await expect(page.getByTestId('rating-submitted')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('rating-widget')).not.toBeVisible();
    });
  });

  test.describe('Rating Display', () => {
    test('shows rating on item detail seller card', async ({ page }) => {
      await page.goto(`/items/${listingId}`);

      await expect(page.getByTestId('seller-card')).toBeVisible();
      await expect(page.getByTestId('seller-rating')).toBeVisible();
      await expect(page.getByTestId('seller-rating')).toContainText('4.0');
      await expect(page.getByTestId('seller-rating')).toContainText('(1 rating)');
    });

    test('shows rating on seller profile page', async ({ page }) => {
      await page.goto(`/users/${sellerId}`);

      await expect(page.getByTestId('profile-header')).toBeVisible();
      await expect(page.getByTestId('seller-rating')).toBeVisible();
      await expect(page.getByTestId('seller-rating')).toContainText('4.0');
      await expect(page.getByTestId('seller-rating')).toContainText('(1 rating)');
    });

    test('shows rating on own profile page', async ({ page }) => {
      await page.goto('/profile');

      await expect(page.getByTestId('profile-header')).toBeVisible();
      await expect(page.getByTestId('no-ratings')).toBeVisible();
    });
  });
});
