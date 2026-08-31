import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type Genre,
  fetchGenres,
  fetchListingGenres,
  fetchMainGenres,
  fetchSubgenres,
  setListingGenres,
} from '@/api/genres';

const genreKeys = {
  all: ['genres'] as const,
  lists: () => [...genreKeys.all, 'list'] as const,
  mainGenres: () => [...genreKeys.all, 'main'] as const,
  subgenres: () => [...genreKeys.all, 'subgenres'] as const,
  listingGenres: (listingId: string) => [...genreKeys.all, 'listing', listingId] as const,
};

export function useGenres() {
  return useQuery({
    queryKey: genreKeys.lists(),
    queryFn: async () => {
      const { data, error } = await fetchGenres();
      if (error) throw error;
      return data as Genre[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useMainGenres() {
  return useQuery({
    queryKey: genreKeys.mainGenres(),
    queryFn: async () => {
      const { data, error } = await fetchMainGenres();
      if (error) throw error;
      return data as Genre[];
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export function useSubgenres() {
  return useQuery({
    queryKey: genreKeys.subgenres(),
    queryFn: async () => {
      const { data, error } = await fetchSubgenres();
      if (error) throw error;
      return data as Genre[];
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export function useListingGenres(listingId: string | undefined) {
  return useQuery({
    queryKey: genreKeys.listingGenres(listingId || ''),
    queryFn: async () => {
      if (!listingId) return [];
      const { data, error } = await fetchListingGenres(listingId);
      if (error) throw error;
      return data?.map((item) => item.genres).filter((g): g is Genre => g !== null) || [];
    },
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSetListingGenres() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, genreIds }: { listingId: string; genreIds: string[] }) => {
      const { error } = await setListingGenres(listingId, genreIds);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: genreKeys.listingGenres(variables.listingId) });
    },
  });
}
