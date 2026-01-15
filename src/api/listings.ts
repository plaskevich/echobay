import { supabase } from '@/lib/supabase';

export interface ListingData {
  owner_id: string;
  title: string;
  artist: string;
  format: string;
  genre?: string | null;
  label?: string | null;
  condition?: string | null;
  price: number;
  description?: string | null;
  images: string[];
}

export async function fetchListing(id: string) {
  return await supabase.from('listings').select('*').eq('id', id).single();
}

export async function fetchAllListings() {
  return await supabase
    .from('listings')
    .select('*')
    // .not('status', 'in', '("hidden","sold")')
    .order('created_at', { ascending: false })
    .limit(20);
}

export async function fetchUserListings(userId: string) {
  return await supabase.from('listings').select('*').eq('owner_id', userId).order('created_at', { ascending: false });
}

export async function createListing(listingData: ListingData) {
  return await supabase.from('listings').insert(listingData);
}

export async function updateListing(id: string, listingData: Partial<ListingData>) {
  return await supabase.from('listings').update(listingData).eq('id', id);
}

export async function deleteListing(id: string) {
  return await supabase.from('listings').delete().eq('id', id);
}

export async function markListingAsSold(id: string) {
  return await supabase.from('listings').update({ status: 'sold' }).eq('id', id);
}

export async function hideListing(id: string) {
  return await supabase.from('listings').update({ status: 'hidden' }).eq('id', id);
}
