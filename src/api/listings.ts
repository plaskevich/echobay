import { supabase } from '@/lib/supabase';

export type ListingStatus = 'active' | 'hidden' | 'sold';

export interface ListingData {
  owner_id: string;
  title: string;
  artist: string;
  format: string;
  label?: string | null;
  condition?: string | null;
  price: number;
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
}

export async function fetchListing(id: string, signal?: AbortSignal) {
  void signal;
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

export async function fetchAllListings(filters?: ListingFilters, signal?: AbortSignal) {
  void signal;
  const hasGenreFilter = filters?.genres && filters.genres.length > 0;

  const selectQuery = hasGenreFilter
    ? `
      *,
      listing_genres!inner(
        genre_id,
        genres(id, name, slug)
      )
    `
    : `
      *,
      listing_genres(
        genres(id, name, slug)
      )
    `;

  let query = supabase
    .from('listings')
    .select(selectQuery)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (filters?.search?.trim()) {
    const searchTerm = `%${filters.search.trim()}%`;
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

  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (hasGenreFilter) {
    query = query.in('listing_genres.genre_id', filters.genres!);
  }

  return await query.limit(100);
}

export async function fetchUserListings(userId: string, signal?: AbortSignal) {
  void signal;
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
