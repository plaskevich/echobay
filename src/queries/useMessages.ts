import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type Message,
  type MessageMetadata,
  createChat,
  fetchChat,
  fetchMessages,
  fetchUnreadChats,
  fetchUserChats,
  getChatByListing,
  markChatAsRead,
  sendMessage,
  sendOrderSystemMessages,
} from '@/api/messages';
import { fetchProfilesByIds } from '@/api/profile';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

export const messageKeys = {
  all: ['messages'] as const,
  chats: (userId: string) => [...messageKeys.all, 'chats', userId] as const,
  chat: (chatId: string) => [...messageKeys.all, 'chat', chatId] as const,
  chatByListing: (buyerId: string, sellerId: string, listingId: string) =>
    [...messageKeys.all, 'chatByListing', buyerId, sellerId, listingId] as const,
  messages: (chatId: string) => [...messageKeys.all, 'messages', chatId] as const,
  unreadChats: (userId: string) => [...messageKeys.all, 'unreadChats', userId] as const,
};

export function useUserChats() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user-chats:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats', filter: `seller_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: messageKeys.chats(userId) });
          queryClient.invalidateQueries({ queryKey: messageKeys.unreadChats(userId) });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats', filter: `buyer_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: messageKeys.chats(userId) });
          queryClient.invalidateQueries({ queryKey: messageKeys.unreadChats(userId) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: messageKeys.chats(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await fetchUserChats(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
}

export function useChat(chatId: string | undefined) {
  return useQuery({
    queryKey: messageKeys.chat(chatId || ''),
    queryFn: async () => {
      if (!chatId) return null;
      const { data, error } = await fetchChat(chatId);
      if (error) throw error;
      return data;
    },
    enabled: !!chatId,
  });
}

export function useChatByListing(
  buyerId: string | undefined,
  sellerId: string | undefined,
  listingId: string | undefined
) {
  return useQuery({
    queryKey: messageKeys.chatByListing(buyerId || '', sellerId || '', listingId || ''),
    queryFn: async () => {
      if (!buyerId || !sellerId || !listingId) return null;
      const { data, error } = await getChatByListing(buyerId, sellerId, listingId);
      if (error) throw error;
      return data;
    },
    enabled: !!buyerId && !!sellerId && !!listingId,
  });
}

export function useMessages(chatId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: messageKeys.messages(chatId || ''),
    queryFn: async () => {
      if (!chatId) return [];
      const { data, error } = await fetchMessages(chatId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!chatId,
    staleTime: 1000 * 10,
  });

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          queryClient.setQueryData<Message[]>(messageKeys.messages(chatId), (old) => {
            if (!old) return [newMessage];
            if (old.some((m) => m.id === newMessage.id)) return old;
            return [...old, newMessage];
          });
          queryClient.invalidateQueries({ queryKey: messageKeys.all });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient]);

  return query;
}

export interface ProfileInfo {
  username: string | null;
  avatar_url: string | null;
}

export function useProfilesMap(userIds: string[]) {
  const uniqueIds = [...new Set(userIds)].filter(Boolean);
  return useQuery({
    queryKey: ['profiles', 'batch', uniqueIds.sort()] as const,
    queryFn: async () => {
      const { data, error } = await fetchProfilesByIds(uniqueIds);
      if (error) throw error;
      const map = new Map<string, ProfileInfo>();
      (data || []).forEach((p) => map.set(p.id, { username: p.username, avatar_url: p.avatar_url }));
      return map;
    },
    enabled: uniqueIds.length > 0,
  });
}

export function useUnreadChats() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: messageKeys.unreadChats(userId || ''),
    queryFn: async () => {
      if (!userId) return new Set<string>();
      const { data, error } = await fetchUnreadChats(userId);
      if (error) throw error;
      return new Set((data || []).map((d) => d.chat_id));
    },
    enabled: !!userId,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 60,
  });
}

export function useMarkChatAsRead() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async (chatId: string) => {
      const { error } = await markChatAsRead(chatId);
      if (error) throw error;
    },
    onMutate: async (chatId: string) => {
      if (!userId) return;
      await queryClient.cancelQueries({ queryKey: messageKeys.unreadChats(userId) });
      queryClient.setQueryData<Set<string>>(messageKeys.unreadChats(userId), (old) => {
        if (!old) return new Set();
        const next = new Set(old);
        next.delete(chatId);
        return next;
      });
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadChats(userId) });
      }
    },
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async ({
      buyerId,
      sellerId,
      listingId,
      orderId,
    }: {
      buyerId: string;
      sellerId: string;
      listingId: string;
      orderId?: string;
    }) => {
      const { data, error } = await createChat(buyerId, sellerId, listingId, orderId);
      if (error) throw error;
      return data!;
    },
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData(messageKeys.chat(data.id), data);
      }
      if (userId) {
        queryClient.invalidateQueries({ queryKey: messageKeys.chats(userId) });
      }
      queryClient.invalidateQueries({
        queryKey: messageKeys.chatByListing(variables.buyerId, variables.sellerId, variables.listingId),
      });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
      type,
      metadata,
    }: {
      chatId: string;
      content: string;
      type?: 'text' | 'system';
      metadata?: MessageMetadata;
    }) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await sendMessage(chatId, userId, content, { type, metadata });
      if (error) throw error;
      return data!;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Message[]>(messageKeys.messages(data.chat_id), (old) => {
        if (!old) return [data];
        if (old.some((m) => m.id === data.id)) return old;
        return [...old, data];
      });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: messageKeys.chats(userId) });
      }
    },
  });
}

export function useSendOrderMessages() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async ({
      chatId,
      orderId,
      listingTitle,
      shippingAddress,
    }: {
      chatId: string;
      orderId: string;
      listingTitle: string;
      shippingAddress: MessageMetadata['shipping_address'];
    }) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await sendOrderSystemMessages(chatId, userId, orderId, listingTitle, shippingAddress);
      if (error) throw error;
      return data!;
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        const chatId = data[0].chat_id;
        queryClient.invalidateQueries({ queryKey: messageKeys.messages(chatId) });
      }
      if (userId) {
        queryClient.invalidateQueries({ queryKey: messageKeys.chats(userId) });
      }
    },
  });
}
