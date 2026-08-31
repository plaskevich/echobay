import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type Favorite, addFavorite, fetchUserFavorites, removeFavorite } from '@/api/favorites';

const favoriteKeys = {
  all: ['favorites'] as const,
  userFavorites: (userId: string) => [...favoriteKeys.all, 'user', userId] as const,
};

const FAVORITES_STALE_TIME = 1000 * 60 * 5; // 5 minutes

async function loadUserFavorites(userId: string) {
  const { data, error } = await fetchUserFavorites(userId);
  if (error) throw error;
  return (data || []) as Favorite[];
}

export function useUserFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: favoriteKeys.userFavorites(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      return loadUserFavorites(userId);
    },
    enabled: !!userId,
    staleTime: FAVORITES_STALE_TIME,
  });
}

export function useIsFavorited(userId: string | undefined, listingId: string) {
  const { data: favorites } = useUserFavorites(userId);

  return favorites?.some((favorite) => favorite.listing_id === listingId) ?? false;
}

function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, listingId }: { userId: string; listingId: string }) => {
      const { error } = await addFavorite(userId, listingId);
      if (error) throw error;
    },
    onSuccess: (_, { userId, listingId }) => {
      queryClient.setQueryData<Favorite[]>(favoriteKeys.userFavorites(userId), (favorites) =>
        favorites && !favorites.some((favorite) => favorite.listing_id === listingId)
          ? [{ id: listingId, user_id: userId, listing_id: listingId, created_at: '' }, ...favorites]
          : favorites
      );
      queryClient.invalidateQueries({ queryKey: favoriteKeys.userFavorites(userId) });
    },
  });
}

function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, listingId }: { userId: string; listingId: string }) => {
      const { error } = await removeFavorite(userId, listingId);
      if (error) throw error;
    },
    onSuccess: (_, { userId, listingId }) => {
      queryClient.setQueryData<Favorite[]>(favoriteKeys.userFavorites(userId), (favorites) =>
        favorites?.filter((favorite) => favorite.listing_id !== listingId)
      );
      queryClient.invalidateQueries({ queryKey: favoriteKeys.userFavorites(userId) });
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
