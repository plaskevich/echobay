import { supabase } from '@/lib/supabase';

export async function logView(userId: string, listingId: string) {
  return await supabase.from('activity').insert({
    user_id: userId,
    listing_id: listingId,
    type: 'view',
  });
}
