import { Page, expect, test } from '@playwright/test';

import { HOME_EXTRA_LISTINGS, HOME_LISTINGS, HOME_LISTING_GENRES } from '../fixtures/listings';
import { HOME_SELLER_PROFILE } from '../fixtures/profiles';
import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD } from '../helpers/users';

const SELLER_EMAIL = 'seller-home@echobay.local';

test.describe('Home Page', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;

  test.beforeAll(async () => {
    const { user } = await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD);
    sellerId = user.id;

    await supabaseAdmin.from('profiles').upsert({
      id: sellerId,
      ...HOME_SELLER_PROFILE,
    });

    const { data: listings } = await supabaseAdmin
      .from('listings')
      .insert(HOME_LISTINGS.map((l) => ({ ...l, owner_id: sellerId })))
      .select('id');

    if (listings) {
      const genreRows = listings.flatMap((listing, i) =>
        HOME_LISTING_GENRES[i].map((genre_id) => ({ listing_id: listing.id, genre_id }))
      );
      await supabaseAdmin.from('listing_genres').insert(genreRows);
    }
  });

  test.afterAll(async () => {
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await deleteTestUser(SELLER_EMAIL);
  });

  const listingHeading = (page: Page, name: string) => page.getByRole('heading', { name });

  test.describe('Listing Display', () => {
    test('displays listings from other users', async ({ page }) => {
      await page.goto('/');

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).toBeVisible();
      await expect(listingHeading(page, 'Rumours')).toBeVisible();
      await expect(listingHeading(page, 'Thriller')).toBeVisible();
    });

    test('shows listing card details', async ({ page }) => {
      await page.goto('/');

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(page.getByText('Nirvana').first()).toBeVisible();
      await expect(page.getByText('€25.00')).toBeVisible();
    });

    test('navigates to listing detail when card is clicked', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await listingHeading(page, 'Nevermind').click();

      await expect(page).toHaveURL(/\/items\/.+/);
    });
  });

  test.describe('Search', () => {
    test('searches listings by title', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('search-input').first().fill('Nevermind');
      await page.getByTestId('search-input').first().press('Enter');

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
      await expect(listingHeading(page, 'Thriller')).not.toBeVisible();
    });

    test('searches listings by artist', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('search-input').first().fill('Daft Punk');
      await page.getByTestId('search-input').first().press('Enter');

      await expect(listingHeading(page, 'Random Access Memories')).toBeVisible();
      await expect(listingHeading(page, 'Nevermind')).not.toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
    });

    test('searches by description content', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('search-input').first().fill('Grammy-winning');
      await page.getByTestId('search-input').first().press('Enter');

      await expect(listingHeading(page, 'Random Access Memories')).toBeVisible();
      await expect(listingHeading(page, 'Nevermind')).not.toBeVisible();
    });

    test('shows empty state for no search results', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('search-input').first().fill('xyznonexistent123');
      await page.getByTestId('search-input').first().press('Enter');

      await expect(page.getByText('No items match your filters.')).toBeVisible();
    });

    test('clears search and restores all listings', async ({ page }) => {
      await page.goto('/?q=Nevermind');

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();

      await page.getByTestId('clear-search-button').first().click();

      await expect(listingHeading(page, 'Blue Train')).toBeVisible();
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Thriller')).toBeVisible();
    });
  });

  test.describe('Filters', () => {
    test('filters by format', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-format').click();
      await page.getByText('Vinyl', { exact: true }).first().click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
      await expect(listingHeading(page, 'Thriller')).not.toBeVisible();
      await expect(listingHeading(page, 'Rumours')).not.toBeVisible();
    });

    test('filters by multiple formats', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-format').click();
      await page.getByText('Vinyl', { exact: true }).first().click();
      await page.getByText('Tape', { exact: true }).first().click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).toBeVisible();
      await expect(listingHeading(page, 'Rumours')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
      await expect(listingHeading(page, 'Thriller')).not.toBeVisible();
    });

    test('filters by condition', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-condition').click();
      await page.getByText('Near Mint (NM)').click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Thriller')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).not.toBeVisible();
      await expect(listingHeading(page, 'Rumours')).not.toBeVisible();
    });

    test('filters by genre', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-genres').click();
      await page.getByText('Rock', { exact: true }).click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Rumours')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).not.toBeVisible();
      await expect(listingHeading(page, 'Thriller')).not.toBeVisible();
    });

    test('searches genres within the genre filter dropdown', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-genres').click();
      await page.getByTestId('filter-search-input').fill('elec');
      await expect(page.getByText('Electronic', { exact: true })).toBeVisible();
      await expect(page.getByText('Jazz', { exact: true })).not.toBeVisible();
    });

    test('filters by price range', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-price').click();
      await page.getByTestId('price-min-input').fill('10');
      await page.getByTestId('price-max-input').fill('30');
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Blue Train')).toBeVisible();
      await expect(listingHeading(page, 'Thriller')).toBeVisible();
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Rumours')).not.toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).not.toBeVisible();
    });

    test('sorts listings by cheapest price', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('sort-filter').click();
      await page.getByText('Price: low to high', { exact: true }).click();
      await page.getByTestId('filter-apply-button').click();

      await expect(page.locator('[data-testid="listing-card"] h3').first()).toHaveText('Rumours');
    });

    test('combines search with filters', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-format').click();
      await page.getByText('Vinyl', { exact: true }).first().click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).toBeVisible();

      await page.getByTestId('search-input').first().fill('Nirvana');
      await page.getByTestId('search-input').first().press('Enter');

      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Random Access Memories')).not.toBeVisible();
    });
  });

  test.describe('Filter Pills', () => {
    test('shows active filter pills when filters are applied', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-format').click();
      await page.getByText('Vinyl', { exact: true }).first().click();
      await page.getByTestId('filter-apply-button').click();

      await expect(page.getByLabel('Remove Vinyl filter')).toBeVisible();
    });

    test('removes filter when pill is dismissed', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-format').click();
      await page.getByText('CD', { exact: true }).first().click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Nevermind')).not.toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).toBeVisible();

      await page.getByLabel('Remove CD filter').click();
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Blue Train')).toBeVisible();
    });

    test('clears all filters at once', async ({ page }) => {
      await page.goto('/');
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();

      await page.getByTestId('filter-dropdown-format').click();
      await page.getByText('Vinyl', { exact: true }).first().click();
      await page.getByTestId('filter-apply-button').click();

      await expect(listingHeading(page, 'Blue Train')).not.toBeVisible();
      await page.getByTestId('clear-filters-button').click();

      await expect(listingHeading(page, 'Blue Train')).toBeVisible();
      await expect(listingHeading(page, 'Nevermind')).toBeVisible();
      await expect(listingHeading(page, 'Thriller')).toBeVisible();
    });
  });

  test.describe('Pagination', () => {
    test.beforeAll(async () => {
      await supabaseAdmin.from('listings').insert(HOME_EXTRA_LISTINGS.map((l) => ({ ...l, owner_id: sellerId })));
    });
    test('navigates to next page and back', async ({ page }) => {
      await page.goto('/?pageSize=60');
      await expect(page.getByText(/1-\d+ of \d+ items/)).toBeVisible();
      await page.getByTestId('next-page-button').click();
      await expect(page).toHaveURL(/page=2/);
      await page.getByTestId('previous-page-button').click();
      await expect(page).toHaveURL(/page=1/);
    });

    test('changes page size via selector', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText(/\d+-\d+ of \d+ items/)).toBeVisible();
      await page.locator('select').selectOption('60');
      await expect(page).toHaveURL(/pageSize=60/);
      await expect(page).toHaveURL(/page=1/);
    });
  });
});
