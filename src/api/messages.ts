import { supabase } from '@/lib/supabase';

export interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  order_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type SystemEvent = 'order_placed' | 'shipping_info' | 'shipped' | 'delivered';

export interface MessageMetadata {
  event: SystemEvent;
  order_id: string;
  listing_title?: string;
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
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'system';
  metadata?: MessageMetadata | null;
  created_at: string;
}

export interface ListingSummary {
  id: string;
  title: string;
  artist: string;
  format: string;
  price: number;
  images: string[] | null;
  owner_id: string;
  status?: string | null;
}

export interface ChatWithDetails extends Chat {
  listings: ListingSummary | null;
}

function normalizeListings(listings: ListingSummary | ListingSummary[] | null | undefined): ListingSummary | null {
  if (listings == null) return null;
  return Array.isArray(listings) ? (listings[0] ?? null) : listings;
}

export async function fetchUserChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      id,
      buyer_id,
      seller_id,
      listing_id,
      order_id,
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id,
        status
      )
    `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) return { data: null, error };
  const normalized = (data || []).map((d: Record<string, unknown>) => ({
    ...d,
    listings: normalizeListings(d.listings as ListingSummary | ListingSummary[] | null),
  }));
  return { data: normalized as ChatWithDetails[], error: null };
}

export async function getChatByListing(buyerId: string, sellerId: string, listingId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      id,
      buyer_id,
      seller_id,
      listing_id,
      order_id,
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id,
        status
      )
    `
    )
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('listing_id', listingId)
    .maybeSingle();

  if (error) return { data: null, error };
  const normalized = data
    ? {
        ...data,
        listings: normalizeListings((data as { listings?: ListingSummary | ListingSummary[] | null }).listings),
      }
    : null;
  return { data: normalized as ChatWithDetails | null, error: null };
}

export async function createChat(buyerId: string, sellerId: string, listingId: string, orderId?: string) {
  const { data, error } = await supabase
    .from('chats')
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      listing_id: listingId,
      ...(orderId ? { order_id: orderId } : {}),
    })
    .select(
      `
      id,
      buyer_id,
      seller_id,
      listing_id,
      order_id,
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id,
        status
      )
    `
    )
    .single();

  if (error) return { data: null, error };
  const normalized = data
    ? {
        ...data,
        listings: normalizeListings((data as { listings?: ListingSummary | ListingSummary[] | null }).listings),
      }
    : null;
  return { data: normalized as ChatWithDetails, error: null };
}

export async function fetchChat(chatId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      id,
      buyer_id,
      seller_id,
      listing_id,
      order_id,
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id,
        status
      )
    `
    )
    .eq('id', chatId)
    .single();

  if (error) return { data: null, error };
  const normalized = data
    ? {
        ...data,
        listings: normalizeListings((data as { listings?: ListingSummary | ListingSummary[] | null }).listings),
      }
    : null;
  return { data: normalized as ChatWithDetails, error: null };
}

export async function fetchMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      id,
      chat_id,
      sender_id,
      content,
      type,
      metadata,
      created_at
    `
    )
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) return { data: null, error };
  return { data: data as Message[], error };
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string,
  options?: { type?: 'text' | 'system'; metadata?: MessageMetadata }
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      content,
      type: options?.type ?? 'text',
      metadata: options?.metadata ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error };
  return { data: data as Message, error };
}

export async function sendOrderSystemMessages(
  chatId: string,
  senderId: string,
  orderId: string,
  listingTitle: string,
  shippingAddress: MessageMetadata['shipping_address']
) {
  const messages = [
    {
      chat_id: chatId,
      sender_id: senderId,
      content: `Order placed for "${listingTitle}"`,
      type: 'system' as const,
      metadata: { event: 'order_placed' as const, order_id: orderId, listing_title: listingTitle },
    },
    {
      chat_id: chatId,
      sender_id: senderId,
      content: 'Shipping details provided',
      type: 'system' as const,
      metadata: {
        event: 'shipping_info' as const,
        order_id: orderId,
        listing_title: listingTitle,
        shipping_address: shippingAddress,
      },
    },
  ];

  const { data, error } = await supabase.from('messages').insert(messages).select();
  if (error) return { data: null, error };
  return { data: data as Message[], error: null };
}

export async function fetchUnreadChats(userId: string) {
  const { data, error } = await supabase.rpc('get_unread_chats', { p_user_id: userId });
  if (error) return { data: null, error };
  return { data: data as { chat_id: string }[], error: null };
}

export async function markChatAsRead(chatId: string) {
  const { error } = await supabase.rpc('mark_chat_read', { p_chat_id: chatId });
  return { error };
}
