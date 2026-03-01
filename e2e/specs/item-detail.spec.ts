import { expect, test } from '@playwright/test';

import { BUYER_LISTING, BUYER_LISTING_GENRES, OWNER_LISTINGS } from '../fixtures/listings';
import { DETAIL_SELLER_PROFILE } from '../fixtures/profiles';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, TEST_USER_EMAIL } from '../helpers/users';

const SELLER_EMAIL = 'seller-detail@echobay.local';

test.describe('Item Detail Page', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;
  let buyerListingId: string;
  let ownerListingId: string;
  let hideTestListingId: string;
  let hiddenTestListingId: string;
  let soldTestListingId: string;
  let deleteTestListingId: string;

  test.beforeAll(async () => {
    const { user: seller } = await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = seller.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...DETAIL_SELLER_PROFILE,
    });

    const {
      data: { users },
    } = await supabaseAdmin.auth.admin.listUsers();
    const testUserId = users!.find((u) => u.email === TEST_USER_EMAIL)!.id;

    const { data: sellerListings } = await supabaseAdmin
      .from('listings')
      .insert([{ ...BUYER_LISTING, owner_id: sellerId }])
      .select('id');
    buyerListingId = sellerListings![0].id;

    await supabaseAdmin
      .from('listing_genres')
      .insert(BUYER_LISTING_GENRES.map((genre_id) => ({ listing_id: buyerListingId, genre_id })));

    const { data: ownerListings } = await supabaseAdmin
      .from('listings')
      .insert(OWNER_LISTINGS.map((l) => ({ ...l, owner_id: testUserId })))
      .select('id');

    ownerListingId = ownerListings![0].id;
    hideTestListingId = ownerListings![1].id;
    hiddenTestListingId = ownerListings![2].id;
    soldTestListingId = ownerListings![3].id;
    deleteTestListingId = ownerListings![4].id;
  });

  test.afterAll(async () => {
    await supabaseAdmin.from('listing_genres').delete().eq('listing_id', buyerListingId);
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);

    const ownerIds = [ownerListingId, hideTestListingId, hiddenTestListingId, soldTestListingId, deleteTestListingId];
    for (const id of ownerIds) {
      await supabaseAdmin.from('listings').delete().eq('id', id);
    }

    await deleteTestUser(SELLER_EMAIL);
  });

  test.describe('Buyer View', () => {
    test('displays all listing details', async ({ page }) => {
      await page.goto(`/items/${buyerListingId}`);

      await expect(page.getByRole('heading', { name: 'In Rainbows' })).toBeVisible();
      await expect(page.getByTestId('artist')).toHaveText('Radiohead');

      await expect(page.getByTestId('listing-price')).toHaveText('€35.00');
      await expect(page.getByTestId('listing-shipping')).toHaveText('+ €4.50 shipping');

      await expect(page.getByTestId('listing-format')).toHaveText('Vinyl');
      await expect(page.getByTestId('listing-condition')).toHaveText('Near Mint (NM)');
      await expect(page.getByTestId('listing-year')).toHaveText('2007');
      await expect(page.getByTestId('listing-label')).toHaveText('XL Recordings');

      await expect(page.getByTestId('listing-genres')).toContainText('Rock');
      await expect(page.getByTestId('listing-genres')).toContainText('Alternative Rock');

      await expect(page.getByTestId('listing-description')).toHaveText(
        'Beautiful pressing of the iconic Radiohead album.'
      );

      await expect(page.getByTestId('seller-name')).toHaveText('detailseller');
      await expect(page.getByTestId('seller-location')).toContainText('Amsterdam');
    });

    test('Buy now button navigates to checkout', async ({ page }) => {
      await page.goto(`/items/${buyerListingId}`);
      await expect(page.getByRole('heading', { name: 'In Rainbows' })).toBeVisible();

      await page.getByTestId('buy-now-button').click();

      await expect(page).toHaveURL(`/checkout/${buyerListingId}`);
    });

    test('does not show owner actions', async ({ page }) => {
      await page.goto(`/items/${buyerListingId}`);
      await expect(page.getByRole('heading', { name: 'In Rainbows' })).toBeVisible();

      await expect(page.getByTestId('mark-sold-button')).not.toBeVisible();
      await expect(page.getByTestId('hide-listing-button')).not.toBeVisible();
      await expect(page.getByTestId('edit-listing-button')).not.toBeVisible();
      await expect(page.getByTestId('delete-listing-button')).not.toBeVisible();
    });

    test('seller card links to seller profile', async ({ page }) => {
      await page.goto(`/items/${buyerListingId}`);
      await expect(page.getByTestId('seller-card')).toBeVisible();

      await page.getByTestId('seller-card').click();

      await expect(page).toHaveURL(`/users/${sellerId}`);
    });
  });

  test.describe('Owner View', () => {
    test('shows free shipping when shipping price is zero', async ({ page }) => {
      await page.goto(`/items/${ownerListingId}`);
      await expect(page.getByRole('heading', { name: 'Homework' })).toBeVisible();

      await expect(page.getByTestId('listing-shipping')).toHaveText('Free shipping');
    });

    test('displays owner actions for active listing', async ({ page }) => {
      await page.goto(`/items/${ownerListingId}`);
      await expect(page.getByRole('heading', { name: 'Homework' })).toBeVisible();

      await expect(page.getByTestId('mark-sold-button')).toBeVisible();
      await expect(page.getByTestId('hide-listing-button')).toBeVisible();
      await expect(page.getByTestId('edit-listing-button')).toBeVisible();
      await expect(page.getByTestId('delete-listing-button')).toBeVisible();
    });

    test('does not show buyer actions', async ({ page }) => {
      await page.goto(`/items/${ownerListingId}`);
      await expect(page.getByRole('heading', { name: 'Homework' })).toBeVisible();

      await expect(page.getByTestId('buy-now-button')).not.toBeVisible();
      await expect(page.getByTestId('contact-seller-button')).not.toBeVisible();
    });

    test('Edit Listing button navigates to edit page', async ({ page }) => {
      await page.goto(`/items/${ownerListingId}`);
      await expect(page.getByRole('heading', { name: 'Homework' })).toBeVisible();

      await page.getByTestId('edit-listing-button').click();

      await expect(page).toHaveURL(`/items/${ownerListingId}/edit`);
    });
  });

  test.describe('Hide / Activate', () => {
    test('Hide Listing button hides listing and navigates to profile', async ({ page }) => {
      await page.goto(`/items/${hideTestListingId}`);
      await expect(page.getByRole('heading', { name: 'Discovery' })).toBeVisible();

      await page.getByTestId('hide-listing-button').click();

      await expect(page).toHaveURL('/profile', { timeout: 5000 });
    });

    test('hidden listing shows status banner and Set as Active button', async ({ page }) => {
      await page.goto(`/items/${hiddenTestListingId}`);
      await expect(page.getByRole('heading', { name: 'Human After All' })).toBeVisible();

      await expect(page.getByTestId('status-banner')).toHaveText('Hidden');
      await expect(page.getByTestId('set-active-button')).toBeVisible();
      await expect(page.getByTestId('mark-sold-button')).toBeVisible();
      await expect(page.getByTestId('edit-listing-button')).toBeVisible();
      await expect(page.getByTestId('delete-listing-button')).toBeVisible();
    });

    test('Set as Active button reactivates hidden listing', async ({ page }) => {
      await page.goto(`/items/${hiddenTestListingId}`);
      await expect(page.getByTestId('set-active-button')).toBeVisible();

      await page.getByTestId('set-active-button').click();

      await expect(page.getByTestId('mark-sold-button')).toBeVisible();
      await expect(page.getByTestId('hide-listing-button')).toBeVisible();
      await expect(page.getByTestId('set-active-button')).not.toBeVisible();
    });
  });

  test.describe('Mark as Sold', () => {
    test('Mark as Sold button marks listing and navigates to profile', async ({ page }) => {
      await page.goto(`/items/${soldTestListingId}`);
      await expect(page.getByRole('heading', { name: 'Alive 2007' })).toBeVisible();

      await page.getByTestId('mark-sold-button').click();

      await expect(page).toHaveURL('/profile', { timeout: 5000 });
    });

    test('sold listing shows Sold banner and only Delete button', async ({ page }) => {
      await page.goto(`/items/${soldTestListingId}`);
      await expect(page.getByRole('heading', { name: 'Alive 2007' })).toBeVisible();

      await expect(page.getByTestId('status-banner')).toHaveText('Sold');
      await expect(page.getByTestId('delete-listing-button')).toBeVisible();
      await expect(page.getByTestId('mark-sold-button')).not.toBeVisible();
      await expect(page.getByTestId('hide-listing-button')).not.toBeVisible();
      await expect(page.getByTestId('edit-listing-button')).not.toBeVisible();
    });
  });

  test.describe('Delete', () => {
    test('Cancel button closes delete dialog without deleting', async ({ page }) => {
      await page.goto(`/items/${deleteTestListingId}`);
      await expect(page.getByRole('heading', { name: 'Musique Vol 1' })).toBeVisible();

      await page.getByTestId('delete-listing-button').click();
      await expect(page.getByText('Are you sure you want to delete this listing?')).toBeVisible();

      await page.getByTestId('dialog-cancel').click();

      await expect(page.getByText('Are you sure you want to delete this listing?')).not.toBeVisible();
      await expect(page.getByRole('heading', { name: 'Musique Vol 1' })).toBeVisible();
    });

    test('Confirming delete removes listing and navigates to profile', async ({ page }) => {
      await page.goto(`/items/${deleteTestListingId}`);
      await expect(page.getByRole('heading', { name: 'Musique Vol 1' })).toBeVisible();

      await page.getByTestId('delete-listing-button').click();
      await expect(page.getByText('Are you sure you want to delete this listing?')).toBeVisible();

      await page.getByTestId('dialog-confirm').click();

      await expect(page).toHaveURL('/profile', { timeout: 5000 });
    });
  });
});
