import { supabase } from '@/lib/supabase';

export interface Rating {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  created_at: string;
}

export interface SellerRatingSummary {
  average: number;
  count: number;
}

export async function submitRating(orderId: string, buyerId: string, sellerId: string, rating: number) {
  return await supabase
    .from('ratings')
    .insert({ order_id: orderId, buyer_id: buyerId, seller_id: sellerId, rating })
    .select()
    .single();
}

export async function fetchRatingByOrder(orderId: string) {
  return await supabase.from('ratings').select('*').eq('order_id', orderId).maybeSingle();
}

export async function fetchSellerRatings(
  sellerId: string
): Promise<{ data: SellerRatingSummary; error: null } | { data: null; error: unknown }> {
  const { data, error } = await supabase.from('ratings').select('rating').eq('seller_id', sellerId);

  if (error) return { data: null, error };

  const ratings = data || [];
  if (ratings.length === 0) {
    return { data: { average: 0, count: 0 }, error: null };
  }

  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return {
    data: {
      average: Math.round((sum / ratings.length) * 10) / 10,
      count: ratings.length,
    },
    error: null,
  };
}
