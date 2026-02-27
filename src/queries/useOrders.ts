import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type Order,
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
      const { data, error } = await fetchBoughtOrders(userId);
      if (error) throw error;
      return (data as Order[]) || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSoldOrders(userId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.sold(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await fetchSoldOrders(userId);
      if (error) throw error;
      return (data as Order[]) || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrderForChat(orderId: string | undefined | null) {
  return useQuery({
    queryKey: orderKeys.detail(orderId || ''),
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await fetchOrderForChat(orderId);
      if (error) throw error;
      return data as Order;
    },
    enabled: !!orderId,
    staleTime: 1000 * 30,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { data, error } = await updateOrderStatus(orderId, status);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
