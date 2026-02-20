import { supabase } from '@/lib/supabase';

export async function getOrder(orderId: string) {
  const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data;
}

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

export async function fetchBoughtOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
        *,
        listings (
          id,
          title,
          artist,
          images,
          owner_id
        )
      `
    )
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bought orders: ${error.message}`);
  }

  return data as Order[];
}

export async function fetchSoldOrders(userId: string) {
  const { data: listings, error: listingsError } = await supabase.from('listings').select('id').eq('owner_id', userId);

  if (listingsError) {
    throw new Error(`Failed to fetch user listings: ${listingsError.message}`);
  }

  if (!listings || listings.length === 0) {
    return [];
  }

  const listingIds = listings.map((l) => l.id);

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
        *,
        listings (
          id,
          title,
          artist,
          images,
          owner_id
        )
      `
    )
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch sold orders: ${error.message}`);
  }

  return data as Order[];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Unable to update order status. This is likely a permissions issue — ensure the seller is allowed to update orders in your RLS policy.'
    );
  }

  return data[0] as Order;
}

export async function fetchOrderForChat(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
        *,
        listings (
          id,
          title,
          artist,
          images,
          owner_id
        )
      `
    )
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data as Order;
}
