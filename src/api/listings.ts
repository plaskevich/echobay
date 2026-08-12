import type { GenreRef } from '@/api/genres';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants/listings';
import { supabase } from '@/lib/supabase';

export type ListingStatus = 'active' | 'hidden' | 'sold';

export interface Listing {
  id: string;
  title: string;
  artist: string;
  year?: number | null;
  description: string;
  price: number;
  shipping_price?: number;
  format?: string;
  images?: string[];
  created_at: string;
  owner_id: string;
  status?: ListingStatus;
}

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
  listing_genres?: Array<{ genres: GenreRef }>;
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
  recentViewIds?: string[];
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
    .maybeSingle();

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

interface RankedListingRow extends ListingWithGenres {
  score: number;
  total_count: number;
}

async function fetchRecommendedListings(
  filters: ListingFilters,
  page: number,
  pageSize: number
): Promise<{ data: PaginatedListings | null; error: unknown }> {
  const from = (page - 1) * pageSize;

  const { data, error } = await supabase.rpc('get_ranked_listings', {
    p_user_id: filters.recommendForUserId ?? null,
    p_recent_view_ids: filters.recentViewIds ?? [],
    p_sort: 'recommended',
    p_search: filters.search?.trim() || null,
    p_formats: filters.formats?.length ? filters.formats : null,
    p_conditions: filters.conditions?.length ? filters.conditions : null,
    p_genre_ids: filters.genres?.length ? filters.genres : null,
    p_price_min: filters.price?.min ?? null,
    p_price_max: filters.price?.max ?? null,
    p_year_min: filters.year?.min ?? null,
    p_year_max: filters.year?.max ?? null,
    p_exclude_owner: filters.excludeOwnerId ?? null,
    p_limit: pageSize,
    p_offset: from,
  });

  if (error || !data) return { data: null, error };

  const rows = data as RankedListingRow[];
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  return {
    data: {
      items: rows as ListingWithGenres[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
    error: null,
  };
}

export async function fetchAllListings(
  filters?: ListingFilters
): Promise<{ data: PaginatedListings | null; error: unknown }> {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? PAGE_SIZE_OPTIONS[0];

  if (filters?.sortBy === 'recommended') {
    return fetchRecommendedListings(filters, page, pageSize);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = buildListingsQuery(filters, { count: true });
  const { data, error, count } = await query.range(from, to);
  if (error || !data) return { data: null, error };

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
