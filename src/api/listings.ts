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
  minPrice?: number;
  maxPrice?: number;
  excludeOwnerId?: string;
  recommendForUserId?: string;
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

function buildListingsQuery(filters?: ListingFilters) {
  const hasGenreFilter = filters?.genres && filters.genres.length > 0;

  const selectQuery = hasGenreFilter
    ? `*, listing_genres!inner(genre_id, genres(id, name, slug))`
    : `*, listing_genres(genres(id, name, slug))`;

  let query = supabase
    .from('listings')
    .select(selectQuery)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (filters?.search?.trim()) {
    const normalizedSearch = filters.search.trim().replace(/[\s-]+/g, '%');
    const searchTerm = `%${normalizedSearch}%`;
    query = query.or(
      `title.ilike.${searchTerm},artist.ilike.${searchTerm},label.ilike.${searchTerm},description.ilike.${searchTerm}`
    );
  }

  if (filters?.formats && filters.formats.length > 0) {
    query = query.in('format', filters.formats);
  }

  if (filters?.conditions && filters.conditions.length > 0) {
    query = query.in('condition', filters.conditions);
  }

  if (filters?.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
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
    const scoreMap = new Map(recs.map((r: { listing_id: string; score: number }) => [r.listing_id, r.score]));
    data.sort((a, b) => (scoreMap.get(b.id) ?? -1) - (scoreMap.get(a.id) ?? -1));
  }
}

export async function fetchAllListings(filters?: ListingFilters) {
  const query = buildListingsQuery(filters);
  const { data, error } = await query.limit(100);
  if (error || !data) return { data, error };

  if (filters?.recommendForUserId) {
    await applyRecommendationSort(data, filters.recommendForUserId);
  }

  return { data, error: null };
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
