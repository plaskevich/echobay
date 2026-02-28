import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type Rating,
  type SellerRatingSummary,
  fetchRatingByOrder,
  fetchSellerRatings,
  submitRating,
} from '@/api/ratings';

export const ratingKeys = {
  all: ['ratings'] as const,
  seller: (sellerId: string) => [...ratingKeys.all, 'seller', sellerId] as const,
  order: (orderId: string) => [...ratingKeys.all, 'order', orderId] as const,
};

export function useSellerRating(sellerId: string | undefined) {
  return useQuery({
    queryKey: ratingKeys.seller(sellerId || ''),
    queryFn: async () => {
      if (!sellerId) return { average: 0, count: 0 } as SellerRatingSummary;
      const { data, error } = await fetchSellerRatings(sellerId);
      if (error) throw error;
      return data!;
    },
    enabled: !!sellerId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrderRating(orderId: string | undefined) {
  return useQuery({
    queryKey: ratingKeys.order(orderId || ''),
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await fetchRatingByOrder(orderId);
      if (error) throw error;
      return data as Rating | null;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmitRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      buyerId,
      sellerId,
      rating,
    }: {
      orderId: string;
      buyerId: string;
      sellerId: string;
      rating: number;
    }) => {
      const { data, error } = await submitRating(orderId, buyerId, sellerId, rating);
      if (error) throw error;
      return data as Rating;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.seller(data.seller_id) });
      queryClient.invalidateQueries({ queryKey: ratingKeys.order(data.order_id) });
    },
  });
}
