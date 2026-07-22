import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

import { EDITABLE_LISTING } from '../fixtures/listings';
import { supabaseAdmin } from '../helpers/supabase';
import { getTestUserId } from '../helpers/users';

function hasDiscogsCredentials(): boolean {
  try {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const content = fs.readFileSync(path.resolve(dir, '../../supabase/functions/.env'), 'utf8');
    const value = (name: string) => content.match(new RegExp(`^${name}=(.+)$`, 'm'))?.[1]?.trim();
    return Boolean(value('DISCOGS_KEY') && value('DISCOGS_SECRET'));
  } catch {
    return false;
  }
}

const discogsDescribe = hasDiscogsCredentials() ? test.describe : test.describe.skip;

test.describe('Create Listing', () => {
  test.describe.configure({ mode: 'serial' });

  let createdListingId: string | undefined;

  test.afterAll(async () => {
    if (createdListingId) {
      await supabaseAdmin.from('listing_genres').delete().eq('listing_id', createdListingId);
      await supabaseAdmin.from('listings').delete().eq('id', createdListingId);
    }
  });

  test('cancel without changes navigates to profile', async ({ page }) => {
    await page.goto('/items/new');
    await expect(page.getByRole('heading', { name: 'Sell Your Item' })).toBeVisible();

    await page.getByTestId('listing-cancel-button').click();

    await expect(page).toHaveURL('/profile');
  });

  test('staying on page after cancel dialog keeps form data', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('listing-title-input').fill('Keep this');
    await page.getByTestId('listing-cancel-button').click();
    await expect(page.getByText('You have unsaved changes')).toBeVisible();

    await page.getByTestId('dialog-cancel').click();

    await expect(page.getByText('You have unsaved changes')).not.toBeVisible();
    await expect(page.getByTestId('listing-title-input')).toHaveValue('Keep this');
  });

  test('confirming cancel dialog navigates away', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('listing-title-input').fill('Discard this');
    await page.getByTestId('listing-cancel-button').click();
    await expect(page.getByText('You have unsaved changes')).toBeVisible();

    await page.getByTestId('dialog-confirm').click();

    await expect(page).toHaveURL('/profile');
  });

  test('creates listing with required fields only', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('listing-title-input').fill('Test Vinyl Record');
    await page.getByTestId('listing-artist-input').fill('Test Artist');
    await page.getByTestId('listing-format-select').selectOption('vinyl');
    await page.getByTestId('listing-condition-select').selectOption('Near Mint (NM)');
    await page.getByTestId('listing-year-input').fill('1990');

    await page.getByTestId('listing-price-input').fill('19.99');

    await page.getByTestId('listing-submit-button').click();

    await expect(page).toHaveURL('/profile', { timeout: 10000 });

    const { data } = await supabaseAdmin
      .from('listings')
      .select('id')
      .eq('title', 'Test Vinyl Record')
      .eq('artist', 'Test Artist')
      .single();
    createdListingId = data?.id;
  });
});

test.describe('Create Listing – Full Form', () => {
  test.describe.configure({ mode: 'serial' });

  let createdListingId: string | undefined;
  let testUserId: string;

  test.beforeAll(async () => {
    testUserId = await getTestUserId();
  });

  test.afterAll(async () => {
    if (createdListingId) {
      await supabaseAdmin.from('listing_genres').delete().eq('listing_id', createdListingId);
      await supabaseAdmin.from('listings').delete().eq('id', createdListingId);
    }
  });

  test('creates listing with all fields and genres', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('listing-title-input').fill('Wish You Were Here');
    await page.getByTestId('listing-artist-input').fill('Pink Floyd');
    await page.getByTestId('listing-year-input').fill('1975');
    await page.getByTestId('listing-label-input').fill('Harvest');
    await page.getByTestId('listing-format-select').selectOption('vinyl');
    await page.getByTestId('listing-condition-select').selectOption('Near Mint (NM)');

    await page.getByPlaceholder('Select main genres...').click();
    await page
      .locator('div')
      .filter({ hasText: /^Rock$/ })
      .first()
      .click();

    await page.getByTestId('listing-price-input').fill('42.00');
    await page.getByTestId('listing-shipping-input').fill('5.00');
    await page.getByTestId('listing-description-input').fill('Original 1975 pressing in excellent condition.');

    await page.getByTestId('listing-submit-button').click();

    await expect(page).toHaveURL('/profile', { timeout: 10000 });

    const { data } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('title', 'Wish You Were Here')
      .eq('artist', 'Pink Floyd')
      .eq('owner_id', testUserId)
      .single();

    expect(data).toBeTruthy();
    expect(data!.format).toBe('vinyl');
    expect(data!.price).toBe(42);
    expect(data!.shipping_price).toBe(5);
    expect(data!.year).toBe(1975);
    expect(data!.label).toBe('Harvest');
    expect(data!.condition).toBe('Near Mint (NM)');
    expect(data!.description).toBe('Original 1975 pressing in excellent condition.');

    createdListingId = data?.id;
  });

  test('created listing appears on profile page', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Wish You Were Here' })).toBeVisible();
  });

  test('created listing detail page shows correct data', async ({ page }) => {
    expect(createdListingId).toBeTruthy();
    await page.goto(`/items/${createdListingId}`);

    await expect(page.getByRole('heading', { name: 'Wish You Were Here' })).toBeVisible();
    await expect(page.getByTestId('artist')).toHaveText('Pink Floyd');
    await expect(page.getByTestId('listing-price')).toHaveText('€42.00');
    await expect(page.getByTestId('listing-shipping')).toHaveText('+ €5.00 shipping');
    await expect(page.getByTestId('listing-format')).toHaveText('Vinyl');
    await expect(page.getByTestId('listing-condition')).toHaveText('Near Mint (NM)');
    await expect(page.getByTestId('listing-year')).toHaveText('1975');
    await expect(page.getByTestId('listing-label')).toHaveText('Harvest');
    await expect(page.getByTestId('listing-description')).toHaveText('Original 1975 pressing in excellent condition.');
  });
});

test.describe('Edit Listing', () => {
  test.describe.configure({ mode: 'serial' });

  let testListingId: string;

  test.beforeAll(async () => {
    const testUserId = await getTestUserId();

    const { data } = await supabaseAdmin
      .from('listings')
      .insert({ ...EDITABLE_LISTING, owner_id: testUserId })
      .select('id')
      .single();

    testListingId = data!.id;
  });

  test.afterAll(async () => {
    await supabaseAdmin.from('listing_genres').delete().eq('listing_id', testListingId);
    await supabaseAdmin.from('listings').delete().eq('id', testListingId);
  });

  test('loads existing data into form', async ({ page }) => {
    await page.goto(`/items/${testListingId}/edit`);

    await expect(page.getByRole('heading', { name: 'Edit Listing' })).toBeVisible();
    await expect(page.getByTestId('listing-submit-button')).toHaveText('Save Changes');

    await expect(page.getByTestId('listing-title-input')).toHaveValue(EDITABLE_LISTING.title);
    await expect(page.getByTestId('listing-artist-input')).toHaveValue(EDITABLE_LISTING.artist);
    await expect(page.getByTestId('listing-format-select')).toHaveValue(EDITABLE_LISTING.format);
    await expect(page.getByTestId('listing-condition-select')).toHaveValue(EDITABLE_LISTING.condition);
    await expect(page.getByTestId('listing-price-input')).toHaveValue('15');
    await expect(page.getByTestId('listing-shipping-input')).toHaveValue('2.5');
    await expect(page.getByTestId('listing-year-input')).toHaveValue(String(EDITABLE_LISTING.year));
    await expect(page.getByTestId('listing-label-input')).toHaveValue(EDITABLE_LISTING.label);
    await expect(page.getByTestId('listing-description-input')).toHaveValue(EDITABLE_LISTING.description);
  });

  test('cancel without changes navigates to item detail', async ({ page }) => {
    await page.goto(`/items/${testListingId}/edit`);
    await expect(page.getByTestId('listing-title-input')).toHaveValue(EDITABLE_LISTING.title);

    await page.getByTestId('listing-cancel-button').click();

    await expect(page).toHaveURL(`/items/${testListingId}`);
  });

  test('confirming cancel navigates to item detail', async ({ page }) => {
    await page.goto(`/items/${testListingId}/edit`);
    await expect(page.getByTestId('listing-title-input')).toHaveValue(EDITABLE_LISTING.title);

    await page.getByTestId('listing-title-input').fill('Discard this');
    await page.getByTestId('listing-cancel-button').click();
    await expect(page.getByText('You have unsaved changes')).toBeVisible();

    await page.getByTestId('dialog-confirm').click();

    await expect(page).toHaveURL(`/items/${testListingId}`);
  });

  test('updates listing fields and saves', async ({ page }) => {
    await page.goto(`/items/${testListingId}/edit`);
    await expect(page.getByTestId('listing-title-input')).toHaveValue(EDITABLE_LISTING.title);

    await page.getByTestId('listing-title-input').clear();
    await page.getByTestId('listing-title-input').fill('Updated Album');
    await page.getByTestId('listing-artist-input').clear();
    await page.getByTestId('listing-artist-input').fill('Updated Artist');
    await page.getByTestId('listing-format-select').selectOption('vinyl');
    await page.getByTestId('listing-condition-select').selectOption('Near Mint (NM)');
    await page.getByTestId('listing-price-input').clear();
    await page.getByTestId('listing-price-input').fill('25.50');
    await page.getByTestId('listing-shipping-input').clear();
    await page.getByTestId('listing-shipping-input').fill('4.00');
    await page.getByTestId('listing-year-input').clear();
    await page.getByTestId('listing-year-input').fill('2010');
    await page.getByTestId('listing-label-input').clear();
    await page.getByTestId('listing-label-input').fill('New Label');
    await page.getByTestId('listing-description-input').clear();
    await page.getByTestId('listing-description-input').fill('Updated description text');

    await page.getByTestId('listing-submit-button').click();

    await expect(page).toHaveURL(`/items/${testListingId}`, { timeout: 10000 });
  });

  test('item detail reflects updated data', async ({ page }) => {
    await page.goto(`/items/${testListingId}`);

    await expect(page.getByRole('heading', { name: 'Updated Album' })).toBeVisible();
    await expect(page.getByTestId('artist')).toHaveText('Updated Artist');
    await expect(page.getByTestId('listing-price')).toHaveText('€25.50');
    await expect(page.getByTestId('listing-shipping')).toHaveText('+ €4.00 shipping');
    await expect(page.getByTestId('listing-format')).toHaveText('Vinyl');
    await expect(page.getByTestId('listing-condition')).toHaveText('Near Mint (NM)');
    await expect(page.getByTestId('listing-year')).toHaveText('2010');
    await expect(page.getByTestId('listing-label')).toHaveText('New Label');
    await expect(page.getByTestId('listing-description')).toHaveText('Updated description text');
  });
});

discogsDescribe('Discogs Auto-Fill', () => {
  test('selecting a result auto-fills form fields', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('discogs-search-input').fill('Nevermind Nirvana');
    await page.getByTestId('discogs-search-button').click();
    await expect(page.getByTestId('discogs-results')).toBeVisible({ timeout: 15000 });

    await page.locator('[data-testid^="discogs-result-"]').first().click();

    await expect(page.getByTestId('listing-title-input')).not.toHaveValue('');
    await expect(page.getByTestId('listing-artist-input')).not.toHaveValue('');
  });

  test('search results close after selecting a release', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('discogs-search-input').fill('Nevermind Nirvana');
    await page.getByTestId('discogs-search-button').click();
    await expect(page.getByTestId('discogs-results')).toBeVisible({ timeout: 15000 });

    await page.locator('[data-testid^="discogs-result-"]').first().click();

    await expect(page.getByTestId('discogs-results')).not.toBeVisible();
  });

  test('auto-filled fields can be edited before submitting', async ({ page }) => {
    await page.goto('/items/new');

    await page.getByTestId('discogs-search-input').fill('Nevermind Nirvana');
    await page.getByTestId('discogs-search-button').click();
    await expect(page.getByTestId('discogs-results')).toBeVisible({ timeout: 15000 });

    await page.locator('[data-testid^="discogs-result-"]').first().click();
    await expect(page.getByTestId('listing-title-input')).not.toHaveValue('');

    const autoFilledArtist = await page.getByTestId('listing-artist-input').inputValue();

    await page.getByTestId('listing-title-input').clear();
    await page.getByTestId('listing-title-input').fill('My Custom Title');

    await expect(page.getByTestId('listing-title-input')).toHaveValue('My Custom Title');
    await expect(page.getByTestId('listing-artist-input')).toHaveValue(autoFilledArtist);
  });
});
