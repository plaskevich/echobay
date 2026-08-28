import { supabase } from '@/lib/supabase';

export type OrderStatus = 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'failed';

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  amount: number;
  stripe_payment_intent_id: string;
  status: OrderStatus;
  shipping_address?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  created_at: string;
  listings?: {
    id: string;
    title: string;
    artist: string;
    images?: string[];
    owner_id: string;
  };
}

const ORDER_SELECT = `
  *,
  listings (
    id,
    title,
    artist,
    images,
    owner_id
  )
`;

export async function fetchBoughtOrders(userId: string) {
  return await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false });
}

export async function fetchSoldOrders(userId: string) {
  const { data: listings, error: listingsError } = await supabase.from('listings').select('id').eq('owner_id', userId);

  if (listingsError) return { data: null, error: listingsError };
  if (!listings || listings.length === 0) return { data: [] as Order[], error: null };

  const listingIds = listings.map((l) => l.id);

  return await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select();

  if (error) return { data: null, error };

  if (!data || data.length === 0) {
    return {
      data: null,
      error: new Error(
        'Unable to update order status. This is likely a permissions issue, ensure the seller is allowed to update orders in your RLS policy.'
      ),
    };
  }

  return { data: data[0] as Order, error: null };
}

export async function fetchOrderForChat(orderId: string) {
  return await supabase.from('orders').select(ORDER_SELECT).eq('id', orderId).single();
}
