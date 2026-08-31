import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type ShippingAddress, fetchShippingAddress, saveShippingAddress } from '@/api/shipping';

const shippingKeys = {
  all: ['shipping'] as const,
  address: (userId: string) => [...shippingKeys.all, 'address', userId] as const,
};

export function useShippingAddress(userId: string | undefined) {
  return useQuery({
    queryKey: shippingKeys.address(userId || ''),
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await fetchShippingAddress(userId);
      if (error) throw error;
      return (data?.address as ShippingAddress) || null;
    },
    enabled: !!userId,
  });
}

export function useSaveShippingAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, address }: { userId: string; address: ShippingAddress }) => {
      const { error } = await saveShippingAddress(userId, address);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.address(variables.userId) });
    },
  });
}
