import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type ListingData,
  type ListingFilters,
  type PaginatedListings,
  createListing,
  deleteListing,
  fetchAllListings,
  fetchListing,
  fetchPublicUserListings,
  fetchUserListings,
  updateListing,
  updateListingStatus,
} from '@/api/listings';
import { useAuthStore } from '@/store/auth-store';

function normalizeFilters(filters?: ListingFilters): ListingFilters {
  if (!filters) return {};
  const normalized: ListingFilters = {};
  if (filters.search) normalized.search = filters.search;
  if (filters.formats?.length) normalized.formats = [...filters.formats].sort();
  if (filters.conditions?.length) normalized.conditions = [...filters.conditions].sort();
  if (filters.genres?.length) normalized.genres = [...filters.genres].sort();
  if (filters.minPrice !== undefined) normalized.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) normalized.maxPrice = filters.maxPrice;
  if (filters.sortBy) normalized.sortBy = filters.sortBy;
  if (filters.excludeOwnerId) normalized.excludeOwnerId = filters.excludeOwnerId;
  if (filters.recommendForUserId) normalized.recommendForUserId = filters.recommendForUserId;
  if (filters.page !== undefined) normalized.page = filters.page;
  if (filters.pageSize !== undefined) normalized.pageSize = filters.pageSize;
  return normalized;
}

export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (filters?: ListingFilters) => [...listingKeys.lists(), normalizeFilters(filters)] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
  userListings: (userId: string) => [...listingKeys.all, 'user', userId] as const,
};

export function useListings(filters?: ListingFilters) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const normalizedFilters = normalizeFilters(filters);

  return useQuery<PaginatedListings>({
    queryKey: listingKeys.list(normalizedFilters),
    queryFn: async () => {
      const { data, error } = await fetchAllListings(normalizedFilters);
      if (error) throw error;
      return data || { items: [], total: 0, page: 1, pageSize: 25, totalPages: 0 };
    },
    enabled: isInitialized,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useListing(id: string) {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await fetchListing(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id && isInitialized,
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

export function usePublicUserListings(userId: string | undefined) {
  return useQuery({
    queryKey: [...listingKeys.userListings(userId || ''), 'public'],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await fetchPublicUserListings(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
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
