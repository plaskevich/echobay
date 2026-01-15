import { supabase } from '@/lib/supabase';

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export async function fetchUserFavorites(userId: string) {
  return await supabase
    .from('favorites')
    .select(
      `
      *,
      listings (*)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function checkIfFavorited(userId: string, listingId: string) {
  return await supabase.from('favorites').select('id').eq('user_id', userId).eq('listing_id', listingId).maybeSingle();
}

export async function addFavorite(userId: string, listingId: string) {
  return await supabase.from('favorites').insert({
    user_id: userId,
    listing_id: listingId,
  });
}

export async function removeFavorite(userId: string, listingId: string) {
  return await supabase.from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId);
}
