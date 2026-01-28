import { useQuery } from '@tanstack/react-query';

import { fetchBoughtOrders, fetchSoldOrders } from '@/api/orders';

export const orderKeys = {
  all: ['orders'] as const,
  bought: (userId: string) => [...orderKeys.all, 'bought', userId] as const,
  sold: (userId: string) => [...orderKeys.all, 'sold', userId] as const,
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
