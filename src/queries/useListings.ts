import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type ListingData,
  createListing,
  deleteListing,
  fetchAllListings,
  fetchListing,
  fetchUserListings,
  updateListing,
  updateListingStatus,
} from '@/api/listings';

export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...listingKeys.lists(), filters] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
  userListings: (userId: string) => [...listingKeys.all, 'user', userId] as const,
};

export function useListings() {
  return useQuery({
    queryKey: listingKeys.lists(),
    queryFn: async () => {
      const { data, error } = await fetchAllListings();
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await fetchListing(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUserListings(userId: string | undefined) {
  return useQuery({
    queryKey: listingKeys.userListings(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await fetchUserListings(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: ListingData) => {
      const { data, error } = await createListing(listingData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ListingData> }) => {
      const { error } = await updateListing(id, data);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteListing(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useMarkListingAsSold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await updateListingStatus(id, 'sold');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useHideListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await updateListingStatus(id, 'hidden');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useSetListingActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await updateListingStatus(id, 'active');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}
