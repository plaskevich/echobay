import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type OrderStatus,
  fetchBoughtOrders,
  fetchOrderForChat,
  fetchSoldOrders,
  updateOrderStatus,
} from '@/api/orders';

export const orderKeys = {
  all: ['orders'] as const,
  bought: (userId: string) => [...orderKeys.all, 'bought', userId] as const,
  sold: (userId: string) => [...orderKeys.all, 'sold', userId] as const,
  detail: (orderId: string) => [...orderKeys.all, 'detail', orderId] as const,
};

export function useBoughtOrders(userId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.bought(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      return await fetchBoughtOrders(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSoldOrders(userId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.sold(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      return await fetchSoldOrders(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useOrderForChat(orderId: string | undefined | null) {
  return useQuery({
    queryKey: orderKeys.detail(orderId || ''),
    queryFn: async () => {
      if (!orderId) return null;
      return await fetchOrderForChat(orderId);
    },
    enabled: !!orderId,
    staleTime: 1000 * 30,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return await updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
