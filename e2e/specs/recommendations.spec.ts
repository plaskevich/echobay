import { Page, expect, test } from '@playwright/test';

import { createTestUser, deleteTestUser, supabaseAdmin } from '../helpers/supabase';
import { DEFAULT_PASSWORD, getTestUserId } from '../helpers/users';

// Seeded genre ids (from supabase/seed.sql)
const GENRE = {
  rock: 'a0000000-0000-0000-0000-000000000001',
  jazz: 'a0000000-0000-0000-0000-000000000002',
  hiphop: 'a0000000-0000-0000-0000-000000000004',
  country: 'a0000000-0000-0000-0000-000000000008',
} as const;

const SELLER_EMAIL = 'rec-seller@echobay.local';
const FAN_EMAIL = 'rec-fan@echobay.local';

const RECENTLY_VIEWED_KEY = 'echobay-recently-viewed';

// Unique search tokens isolate each scenario's candidate set from the rest of
// the catalog (and from the other scenarios). Every candidate below carries its
// scenario token in the description; the "signal" listing deliberately does not.
const TOKEN = {
  authed: 'zzrecauth',
  trend: 'zzrectrend',
  pers: 'zzrecpers',
} as const;

// Card titles under test.
const T = {
  rockPick: 'Rec Rock Pick',
  countryPick: 'Rec Country Pick',
  popHit: 'Rec Pop Hit',
  coldItem: 'Rec Cold Item',
  jazzCand: 'Rec Jazz Cand',
  hipCand: 'Rec Hip Cand',
  jazzSignal: 'Rec Jazz Signal',
} as const;

const firstCardTitle = (page: Page) => page.locator('[data-testid="listing-card"] h3').first();

test.describe('Recommendations', () => {
  test.describe.configure({ mode: 'serial' });

  let sellerId: string;
  let fanId: string;
  let testUserId: string;
  const id: Record<string, string> = {};

  test.beforeAll(async () => {
    testUserId = await getTestUserId();
    sellerId = (await createTestUser(SELLER_EMAIL, DEFAULT_PASSWORD)).user.id;
    fanId = (await createTestUser(FAN_EMAIL, DEFAULT_PASSWORD)).user.id;

    const base = { owner_id: sellerId, shipping_price: 2, condition: 'Very Good (VG)', status: 'active', images: [] };
    const rows = [
      // Authed scenario: test@echobay.local owns two Rock listings, so its taste
      // profile leans Rock -> the Rock pick should outrank the Country pick.
      {
        key: 'rockPick',
        title: T.rockPick,
        artist: 'RockCand',
        format: 'cd',
        price: 27,
        description: `${TOKEN.authed} rock candidate`,
      },
      {
        key: 'countryPick',
        title: T.countryPick,
        artist: 'CountryCand',
        format: 'vinyl',
        price: 26,
        description: `${TOKEN.authed} country candidate`,
      },
      // Guest trending scenario: popularity should win.
      {
        key: 'popHit',
        title: T.popHit,
        artist: 'PopHit',
        format: 'vinyl',
        price: 20,
        description: `${TOKEN.trend} popular`,
      },
      {
        key: 'coldItem',
        title: T.coldItem,
        artist: 'ColdItem',
        format: 'vinyl',
        price: 21,
        description: `${TOKEN.trend} cold`,
      },
      // Guest personalization scenario: viewing the jazz signal should lift the
      // jazz candidate above the (baseline-favored) hip hop candidate.
      {
        key: 'jazzCand',
        title: T.jazzCand,
        artist: 'JazzCand',
        format: 'vinyl',
        price: 24,
        description: `${TOKEN.pers} jazz`,
      },
      {
        key: 'hipCand',
        title: T.hipCand,
        artist: 'HipCand',
        format: 'vinyl',
        price: 23,
        description: `${TOKEN.pers} hiphop`,
      },
      {
        key: 'jazzSignal',
        title: T.jazzSignal,
        artist: 'JazzSig',
        format: 'vinyl',
        price: 25,
        description: 'no token jazz signal',
      },
    ];

    const { data: inserted, error } = await supabaseAdmin
      .from('listings')
      .insert(
        rows.map((r) => ({
          ...base,
          title: r.title,
          artist: r.artist,
          format: r.format,
          price: r.price,
          description: r.description,
        }))
      )
      .select('id, title');
    if (error) throw error;

    for (const row of inserted!) {
      const key = rows.find((r) => r.title === row.title)!.key;
      id[key] = row.id;
    }

    const genreOf: Record<string, string> = {
      rockPick: GENRE.rock,
      countryPick: GENRE.country,
      popHit: GENRE.rock,
      coldItem: GENRE.rock,
      jazzCand: GENRE.jazz,
      hipCand: GENRE.hiphop,
      jazzSignal: GENRE.jazz,
    };
    await supabaseAdmin
      .from('listing_genres')
      .insert(Object.entries(genreOf).map(([key, genre_id]) => ({ listing_id: id[key], genre_id })));

    // Popularity: the fan favorites the trending pick and the hip hop candidate.
    await supabaseAdmin.from('favorites').insert([
      { user_id: fanId, listing_id: id.popHit },
      { user_id: fanId, listing_id: id.hipCand },
    ]);
  });

  test.afterAll(async () => {
    // Child rows (favorites, listing_genres, activity) cascade on listing delete.
    await supabaseAdmin.from('listings').delete().eq('owner_id', sellerId);
    await deleteTestUser(SELLER_EMAIL);
    await deleteTestUser(FAN_EMAIL);
  });

  // --- Authenticated: default session is test@echobay.local (Rock-leaning) ---
  test.describe('Authenticated', () => {
    test('ranks profile-matching (Rock) listings above unrelated (Country) ones', async ({ page }) => {
      await page.goto(`/?q=${TOKEN.authed}`);

      await expect(page.getByRole('heading', { name: T.rockPick })).toBeVisible();
      await expect(page.getByRole('heading', { name: T.countryPick })).toBeVisible();
      await expect(firstCardTitle(page)).toHaveText(T.rockPick);
    });

    test('logs a product view to the activity table', async ({ page }) => {
      await page.goto(`/items/${id.rockPick}`);
      await expect(page.getByTestId('artist')).toHaveText('RockCand');

      await expect
        .poll(
          async () => {
            const { data } = await supabaseAdmin
              .from('activity')
              .select('id')
              .eq('user_id', testUserId)
              .eq('listing_id', id.rockPick)
              .eq('type', 'view');
            return data?.length ?? 0;
          },
          { timeout: 8000 }
        )
        .toBeGreaterThan(0);
    });
  });

  // --- Guest: no session ---
  test.describe('Guest', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('trending: the popular listing ranks above the cold one', async ({ page }) => {
      await page.goto(`/?q=${TOKEN.trend}`);

      await expect(page.getByRole('heading', { name: T.popHit })).toBeVisible();
      await expect(page.getByRole('heading', { name: T.coldItem })).toBeVisible();
      await expect(firstCardTitle(page)).toHaveText(T.popHit);
    });

    test('personalization: viewing a jazz listing lifts the jazz candidate to the top', async ({ page }) => {
      // Baseline (no history): the favorited hip hop candidate leads.
      await page.goto(`/?q=${TOKEN.pers}`);
      await expect(page.getByRole('heading', { name: T.hipCand })).toBeVisible();
      await expect(firstCardTitle(page)).toHaveText(T.hipCand);

      // View the jazz signal -> recorded in the client-side recently-viewed store.
      await page.goto(`/items/${id.jazzSignal}`);
      await expect(page.getByTestId('artist')).toHaveText('JazzSig');
      await expect
        .poll(async () => page.evaluate((k) => localStorage.getItem(k) ?? '', RECENTLY_VIEWED_KEY))
        .toContain(id.jazzSignal);

      // Now the jazz candidate should be personalized to the top.
      await page.goto(`/?q=${TOKEN.pers}`);
      await expect(page.getByRole('heading', { name: T.jazzCand })).toBeVisible();
      await expect(firstCardTitle(page)).toHaveText(T.jazzCand);
    });
  });
});
