import { expect, test } from '@playwright/test';

import { MESSAGES_LISTING, MESSAGES_LISTING_2 } from '../fixtures/listings';
import { MESSAGES_SELLER_PROFILE } from '../fixtures/profiles';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, TEST_USER_EMAIL } from '../helpers/users';

const SELLER_EMAIL = 'msg-seller@echobay.local';

test.describe('Messages', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;
  let buyerId: string;
  let listingId: string;
  let listingId2: string;

  test.beforeAll(async () => {
    const { user: seller } = await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = seller.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...MESSAGES_SELLER_PROFILE,
    });

    const {
      data: { users },
    } = await supabaseAdmin.auth.admin.listUsers();
    buyerId = users!.find((u) => u.email === TEST_USER_EMAIL)!.id;

    const { data: listings } = await supabaseAdmin
      .from('listings')
      .insert([
        { ...MESSAGES_LISTING, owner_id: sellerId },
        { ...MESSAGES_LISTING_2, owner_id: sellerId },
      ])
      .select('id');

    listingId = listings![0].id;
    listingId2 = listings![1].id;
  });

  test.afterAll(async () => {
    await supabaseAdmin
      .from('messages')
      .delete()
      .in(
        'chat_id',
        (await supabaseAdmin.from('chats').select('id').in('listing_id', [listingId, listingId2])).data?.map(
          (c) => c.id
        ) || []
      );
    await supabaseAdmin.from('chats').delete().in('listing_id', [listingId, listingId2]);
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await deleteTestUser(SELLER_EMAIL);
  });

  test.describe('Empty State', () => {
    test('shows empty state when no conversations exist', async ({ page }) => {
      await supabaseAdmin
        .from('messages')
        .delete()
        .in(
          'chat_id',
          (await supabaseAdmin.from('chats').select('id').eq('buyer_id', buyerId)).data?.map((c) => c.id) || []
        );
      await supabaseAdmin.from('chats').delete().eq('buyer_id', buyerId);

      await page.goto('/messages');

      await expect(page.getByTestId('messages-page')).toBeVisible();
      await expect(page.getByTestId('chat-list-empty')).toBeVisible();
      await expect(page.getByTestId('chat-list-empty')).toHaveText('No conversations yet');
    });
  });

  test.describe('Starting a Conversation', () => {
    test('contact seller button navigates to messages with listing context', async ({ page }) => {
      await page.goto(`/items/${listingId}`);

      await page.getByTestId('contact-seller-button').click();

      await expect(page).toHaveURL(new RegExp(`/messages\\?listingId=${listingId}`));
      await expect(page.getByTestId('messages-page')).toBeVisible();
      await expect(page.getByTestId('conversation-header')).toBeVisible();
    });

    test('conversation header shows listing details', async ({ page }) => {
      await page.goto(`/messages?listingId=${listingId}`);

      await expect(page.getByTestId('conversation-header-artist')).toHaveText(MESSAGES_LISTING.artist);
      await expect(page.getByTestId('conversation-header-title')).toHaveText(MESSAGES_LISTING.title);
      await expect(page.getByTestId('conversation-header-meta')).toContainText('€38.00');
      await expect(page.getByTestId('conversation-header-username')).toHaveText(MESSAGES_SELLER_PROFILE.username);
    });

    test('shows buy button in conversation header for buyer', async ({ page }) => {
      await page.goto(`/messages?listingId=${listingId}`);

      await expect(page.getByTestId('conversation-buy-button')).toBeVisible();
    });

    test('send button is disabled when input is empty', async ({ page }) => {
      await page.goto(`/messages?listingId=${listingId}`);

      await expect(page.getByTestId('message-send-button')).toBeDisabled();
    });

    test('sending first message creates conversation', async ({ page }) => {
      await page.goto(`/messages?listingId=${listingId}`);
      await expect(page.getByTestId('message-input')).toBeVisible();

      await page.getByTestId('message-input').fill('Hi, is this still available?');
      await page.getByTestId('message-send-button').click();

      await expect(page.getByTestId('message-bubble-own')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('message-bubble-own').first().getByTestId('message-content')).toHaveText(
        'Hi, is this still available?'
      );
    });
  });

  test.describe('Messaging', () => {
    test('received message appears as other message bubble', async ({ page }) => {
      const { data: chats } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId);

      const chatId = chats![0].id;

      await supabaseAdmin.from('messages').insert({
        chat_id: chatId,
        sender_id: sellerId,
        content: 'Yes, it is! Great condition.',
        type: 'text',
      });

      await page.goto(`/messages?chatId=${chatId}`);
      await expect(page.getByTestId('messages-list')).toBeVisible();

      await expect(page.getByTestId('message-bubble-other')).toBeVisible();
      await expect(page.getByTestId('message-bubble-other').first().getByTestId('message-content')).toHaveText(
        'Yes, it is! Great condition.'
      );
    });

    test('can send message via Enter key', async ({ page }) => {
      const { data: chats } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId);

      const chatId = chats![0].id;
      await page.goto(`/messages?chatId=${chatId}`);
      await expect(page.getByTestId('message-input')).toBeVisible();

      await page.getByTestId('message-input').fill('Sounds good, thanks!');
      await page.getByTestId('message-input').press('Enter');

      await expect(page.getByTestId('message-content').filter({ hasText: 'Sounds good, thanks!' })).toBeVisible({
        timeout: 10000,
      });
    });

    test('input clears after sending a message', async ({ page }) => {
      const { data: chats } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId);

      const chatId = chats![0].id;
      await page.goto(`/messages?chatId=${chatId}`);
      await expect(page.getByTestId('message-input')).toBeVisible();

      await page.getByTestId('message-input').fill('Another message');
      await page.getByTestId('message-send-button').click();

      await expect(page.getByTestId('message-input')).toHaveValue('', { timeout: 10000 });
    });
  });

  test.describe('Chat Sidebar', () => {
    test('chat appears in sidebar with correct info', async ({ page }) => {
      await page.goto('/messages');

      await expect(page.getByTestId('chat-list-item').first()).toBeVisible();
      await expect(page.getByTestId('chat-list-item').first().getByTestId('chat-item-username')).toHaveText(
        MESSAGES_SELLER_PROFILE.username
      );
      await expect(page.getByTestId('chat-list-item').first().getByTestId('chat-item-title')).toHaveText(
        MESSAGES_LISTING.title
      );
      await expect(page.getByTestId('chat-list-item').first().getByTestId('chat-item-artist')).toHaveText(
        MESSAGES_LISTING.artist
      );
    });

    test('selecting a chat opens the conversation', async ({ page }) => {
      await page.goto('/messages');

      await page.getByTestId('chat-list-item').first().click();

      await expect(page.getByTestId('conversation-header')).toBeVisible();
      await expect(page.getByTestId('messages-list')).toBeVisible();
      await expect(page.getByTestId('message-input')).toBeVisible();
    });

    test('switching between conversations loads correct messages', async ({ page }) => {
      await page.goto(`/messages?listingId=${listingId2}`);
      await expect(page.getByTestId('message-input')).toBeVisible();

      await page.getByTestId('message-input').fill('Interested in this one too');
      await page.getByTestId('message-send-button').click();
      await expect(page.getByTestId('message-content').filter({ hasText: 'Interested in this one too' })).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('chat-list-item')).toHaveCount(2, { timeout: 5000 });

      const firstChat = page.getByTestId('chat-list-item').nth(1);
      await firstChat.click();

      await expect(page.getByTestId('conversation-header-title')).toHaveText(MESSAGES_LISTING.title);
      await expect(
        page.getByTestId('message-content').filter({ hasText: 'Hi, is this still available?' })
      ).toBeVisible();
    });
  });

  test.describe('System Messages', () => {
    test('order placed system message is displayed for buyer', async ({ page }) => {
      const { data: chats } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId);

      const chatId = chats![0].id;

      await supabaseAdmin.from('messages').insert({
        chat_id: chatId,
        sender_id: buyerId,
        content: `Order placed for "${MESSAGES_LISTING.title}"`,
        type: 'system',
        metadata: {
          event: 'order_placed',
          order_id: 'mock-order-id',
          listing_title: MESSAGES_LISTING.title,
        },
      });

      await page.goto(`/messages?chatId=${chatId}`);
      await expect(page.getByTestId('system-message').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('system-message-title').filter({ hasText: 'Order Placed' })).toBeVisible();
    });

    test('shipping info system message is displayed for buyer', async ({ page }) => {
      const { data: chats } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId);

      const chatId = chats![0].id;

      await supabaseAdmin.from('messages').insert({
        chat_id: chatId,
        sender_id: buyerId,
        content: 'Shipping details provided',
        type: 'system',
        metadata: {
          event: 'shipping_info',
          order_id: 'mock-order-id',
          listing_title: MESSAGES_LISTING.title,
          shipping_address: {
            fullName: 'Test Buyer',
            addressLine1: '123 Test Street',
            city: 'Berlin',
            state: '',
            postalCode: '10115',
            country: 'DE',
            phone: '+49 30 12345678',
          },
        },
      });

      await page.goto(`/messages?chatId=${chatId}`);
      await expect(page.getByTestId('system-message-title').filter({ hasText: 'Shipping Details' })).toBeVisible({
        timeout: 10000,
      });
      await expect(
        page.getByTestId('system-message-text').filter({ hasText: 'Shipping details have been sent to the seller' })
      ).toBeVisible();
    });
  });
});
