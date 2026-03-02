import { supabase } from '@/lib/supabase';

export type ListingStatus = 'active' | 'hidden' | 'sold';

export interface ListingData {
  owner_id: string;
  title: string;
  artist: string;
  year?: number | null;
  format: string;
  label?: string | null;
  condition?: string | null;
  price: number;
  shipping_price: number;
  description?: string | null;
  images: string[];
  status?: ListingStatus;
}

export interface ListingWithGenres extends ListingData {
  id: string;
  created_at: string;
  listing_genres?: Array<{
    genres: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface ListingFilters {
  search?: string;
  formats?: string[];
  conditions?: string[];
  genres?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  year?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'recommended' | 'newest' | 'cheapest' | 'most_expensive';
  excludeOwnerId?: string;
  recommendForUserId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedListings {
  items: ListingWithGenres[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchListing(id: string) {
  const query = supabase
    .from('listings')
    .select(
      `
      *,
      listing_genres(
        genres(id, name, slug)
      )
    `
    )
    .eq('id', id)
    .single();

  return await query;
}

function buildListingsQuery(filters?: ListingFilters, { count = false }: { count?: boolean } = {}) {
  const hasGenreFilter = filters?.genres && filters.genres.length > 0;

  const selectQuery = hasGenreFilter
    ? `*, listing_genres!inner(genre_id, genres(id, name, slug))`
    : `*, listing_genres(genres(id, name, slug))`;

  let query = supabase
    .from('listings')
    .select(selectQuery, count ? { count: 'exact' } : {})
    .eq('status', 'active');

  switch (filters?.sortBy) {
    case 'cheapest':
      query = query.order('price', { ascending: true }).order('created_at', { ascending: false });
      break;
    case 'most_expensive':
      query = query.order('price', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'recommended':
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  if (filters?.search?.trim()) {
    const searchTerms = filters.search
      .trim()
      .split(/\s+/)
      .map((term) => term.replace(/[,%()]/g, '').trim())
      .filter(Boolean);

    for (const term of searchTerms) {
      const searchTerm = `%${term}%`;
      query = query.or(
        `title.ilike.${searchTerm},artist.ilike.${searchTerm},label.ilike.${searchTerm},description.ilike.${searchTerm}`
      );
    }
  }

  if (filters?.formats && filters.formats.length > 0) {
    query = query.in('format', filters.formats);
  }

  if (filters?.conditions && filters.conditions.length > 0) {
    query = query.in('condition', filters.conditions);
  }

  if (filters?.price?.min !== undefined) query = query.gte('price', filters.price.min);
  if (filters?.price?.max !== undefined) query = query.lte('price', filters.price.max);
  if (filters?.year?.min !== undefined) query = query.gte('year', filters.year.min);
  if (filters?.year?.max !== undefined) query = query.lte('year', filters.year.max);
  if (hasGenreFilter && filters.genres) query = query.in('listing_genres.genre_id', filters.genres);
  if (filters?.excludeOwnerId) query = query.neq('owner_id', filters.excludeOwnerId);

  return query;
}

async function applyRecommendationSort(data: Array<{ id: string }>, userId: string) {
  const { data: recs } = await supabase.rpc('get_recommendations', {
    target_user_id: userId,
    num_recommendations: 100,
  });

  if (recs && Array.isArray(recs) && recs.length > 0) {
    const originalOrder = new Map(data.map((item, index) => [item.id, index]));
    const scoreMap = new Map(recs.map((r: { listing_id: string; score: number }) => [r.listing_id, r.score]));
    data.sort(
      (a, b) =>
        (scoreMap.get(b.id) ?? -1) - (scoreMap.get(a.id) ?? -1) ||
        (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
    );
  }
}

async function applyGuestRecommendationSort(data: Array<{ id: string }>) {
  const { data: recs } = await supabase.rpc('get_guest_recommendations', {
    num_recommendations: 100,
  });

  if (recs && Array.isArray(recs) && recs.length > 0) {
    const originalOrder = new Map(data.map((item, index) => [item.id, index]));
    const scoreMap = new Map(recs.map((r: { listing_id: string; score: number }) => [r.listing_id, r.score]));
    data.sort(
      (a, b) =>
        (scoreMap.get(b.id) ?? -1) - (scoreMap.get(a.id) ?? -1) ||
        (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
    );
  }
}

export async function fetchAllListings(
  filters?: ListingFilters
): Promise<{ data: PaginatedListings | null; error: unknown }> {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = buildListingsQuery(filters, { count: true });
  const { data, error, count } = await query.range(from, to);
  if (error || !data) return { data: null, error };

  if (filters?.sortBy === 'recommended') {
    if (filters?.recommendForUserId) {
      await applyRecommendationSort(data, filters.recommendForUserId);
    } else {
      await applyGuestRecommendationSort(data);
    }
  }

  const total = count ?? 0;
  return {
    data: {
      items: data as ListingWithGenres[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
    error: null,
  };
}

export async function fetchUserListings(userId: string) {
  const query = supabase
    .from('listings')
    .select(
      `
      *,
      listing_genres(
        genres(id, name, slug)
      )
    `
    )
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  return await query;
}

export async function fetchPublicUserListings(userId: string) {
  return await supabase
    .from('listings')
    .select(
      `
      *,
      listing_genres(
        genres(id, name, slug)
      )
    `
    )
    .eq('owner_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
}

export async function createListing(listingData: ListingData) {
  return await supabase.from('listings').insert(listingData).select('id');
}

export async function updateListing(id: string, listingData: Partial<ListingData>) {
  return await supabase.from('listings').update(listingData).eq('id', id);
}

export async function deleteListing(id: string) {
  return await supabase.from('listings').delete().eq('id', id);
}

export async function updateListingStatus(id: string, status: ListingStatus) {
  return await supabase.from('listings').update({ status }).eq('id', id);
}
