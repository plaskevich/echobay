import { create } from 'zustand';

import type { ListingFilters } from '@/api/listings';

const defaultFilters: ListingFilters = { sortBy: 'recommended' };

interface ListingFiltersState {
  filters: ListingFilters;
  appliedFilters: ListingFilters;
  setFilters: (filters: ListingFilters) => void;
  setAppliedFilters: (filters: ListingFilters) => void;
  resetFilters: () => void;
}

export const useListingFiltersStore = create<ListingFiltersState>((set) => ({
  filters: { ...defaultFilters },
  appliedFilters: { ...defaultFilters },
  setFilters: (filters) => set({ filters }),
  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
  resetFilters: () => set({ filters: { ...defaultFilters }, appliedFilters: { ...defaultFilters } }),
}));

export function getDefaultListingFilters() {
  return { ...defaultFilters };
}
