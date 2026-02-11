import { supabase } from '@/lib/supabase';

export interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
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
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id
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
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id
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

export async function createChat(buyerId: string, sellerId: string, listingId: string) {
  const { data, error } = await supabase
    .from('chats')
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      listing_id: listingId,
    })
    .select(
      `
      id,
      buyer_id,
      seller_id,
      listing_id,
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id
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
      created_at,
      updated_at,
      listings (
        id,
        title,
        artist,
        format,
        price,
        images,
        owner_id
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
      created_at
    `
    )
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) return { data: null, error };
  return { data: data as Message[], error };
}

export async function sendMessage(chatId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  if (error) return { data: null, error };
  return { data: data as Message, error };
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
