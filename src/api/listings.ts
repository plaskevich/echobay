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

export async function fetchListing(id: string) {
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
    .eq('id', id)
    .single();
}

export async function fetchAllListings(searchQuery?: string) {
  let query = supabase
    .from('listings')
    .select(
      `
      *,
      listing_genres(
        genres(id, name, slug)
      )
    `
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (searchQuery && searchQuery.trim()) {
    const searchTerm = `%${searchQuery.trim()}%`;
    query = query.or(
      `title.ilike.${searchTerm},artist.ilike.${searchTerm},label.ilike.${searchTerm},description.ilike.${searchTerm}`
    );
  }

  return await query.limit(20);
}

export async function fetchUserListings(userId: string) {
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
