import type { ListingFilters } from '@/api/listings';

export function hasActiveFilters(filters: ListingFilters): boolean {
  return (
    (filters.formats != null && filters.formats.length > 0) ||
    (filters.conditions != null && filters.conditions.length > 0) ||
    (filters.genres != null && filters.genres.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined
  );
}
