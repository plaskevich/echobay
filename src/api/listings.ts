import { supabase } from '@/lib/supabase';

export type ListingStatus = 'active' | 'hidden' | 'sold';

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
  status?: ListingStatus;
}

export async function fetchListing(id: string) {
  return await supabase.from('listings').select('*').eq('id', id).single();
}

export async function fetchAllListings() {
  return await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
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

export async function updateListingStatus(id: string, status: ListingStatus) {
  return await supabase.from('listings').update({ status }).eq('id', id);
}
