import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addFavorite, checkIfFavorited, fetchUserFavorites, removeFavorite } from '@/api/favorites';

export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  userFavorites: (userId: string) => [...favoriteKeys.all, 'user', userId] as const,
  isFavorited: (userId: string, listingId: string) => [...favoriteKeys.all, 'check', userId, listingId] as const,
};

export function useUserFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: favoriteKeys.userFavorites(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await fetchUserFavorites(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useIsFavorited(userId: string | undefined, listingId: string) {
  return useQuery({
    queryKey: favoriteKeys.isFavorited(userId || '', listingId),
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await checkIfFavorited(userId, listingId);
      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!listingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, listingId }: { userId: string; listingId: string }) => {
      const { error } = await addFavorite(userId, listingId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.userFavorites(variables.userId) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.isFavorited(variables.userId, variables.listingId) });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, listingId }: { userId: string; listingId: string }) => {
      const { error } = await removeFavorite(userId, listingId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.userFavorites(variables.userId) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.isFavorited(variables.userId, variables.listingId) });
    },
  });
}

export function useToggleFavorite() {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  return {
    toggleFavorite: async (userId: string, listingId: string, isFavorited: boolean) => {
      if (isFavorited) {
        await removeFavorite.mutateAsync({ userId, listingId });
      } else {
        await addFavorite.mutateAsync({ userId, listingId });
      }
    },
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  };
}
