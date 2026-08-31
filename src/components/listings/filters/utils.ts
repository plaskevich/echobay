import type { Genre } from '@/api/genres';
import type { ListingFilters } from '@/api/listings';
import type { MultiSelectOption } from '@/components/common/MultiSelect';
import { CONDITION_OPTIONS, CURRENCY_SYMBOL, FORMAT_OPTIONS } from '@/lib/constants/listings';

export type ListingSortOption = 'recommended' | 'newest' | 'cheapest' | 'most_expensive';

export type FilterCategory = 'sort' | 'format' | 'condition' | 'genres' | 'price' | 'year';

export const DEFAULT_SORT: ListingSortOption = 'recommended';

export const SORT_OPTIONS: { value: ListingSortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'cheapest', label: 'Price: low to high' },
  { value: 'most_expensive', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
];

export const SORT_LABELS: Record<ListingSortOption, string> = Object.fromEntries(
  SORT_OPTIONS.map((o) => [o.value, o.label])
) as Record<ListingSortOption, string>;

export const formatOptions = FORMAT_OPTIONS.filter((opt) => opt.value !== '').map((opt) => ({
  value: opt.value as string,
  label: opt.label as string,
}));

export const conditionOptions = CONDITION_OPTIONS.filter((opt) => opt.value !== '').map((opt) => ({
  value: opt.value as string,
  label: opt.label as string,
}));

export function toOptionLabelMap(options: { value: string; label: string }[]): Record<string, string> {
  return Object.fromEntries(options.map((opt) => [opt.value, opt.label]));
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return (
    (filters.formats != null && filters.formats.length > 0) ||
    (filters.conditions != null && filters.conditions.length > 0) ||
    (filters.genres != null && filters.genres.length > 0) ||
    filters.price?.min !== undefined ||
    filters.price?.max !== undefined ||
    filters.year?.min !== undefined ||
    filters.year?.max !== undefined
  );
}

export function getActiveFilterCount(filters: ListingFilters): number {
  return [
    (filters.sortBy ?? DEFAULT_SORT) !== DEFAULT_SORT,
    Boolean(filters.formats?.length),
    Boolean(filters.conditions?.length),
    Boolean(filters.genres?.length),
    filters.price?.min !== undefined || filters.price?.max !== undefined,
    filters.year?.min !== undefined || filters.year?.max !== undefined,
  ].filter(Boolean).length;
}

export function isRangeInvalid(min?: number, max?: number): boolean {
  return min !== undefined && max !== undefined && min > max;
}

export function toGenreOptions(genres: Genre[]): MultiSelectOption[] {
  return genres.map((g) => ({ value: g.id, label: g.name }));
}

export function formatRangeLabel(key: 'price' | 'year', range?: { min?: number; max?: number }): string {
  const min = range?.min;
  const max = range?.max;
  if (min === undefined && max === undefined) return 'All';
  if (key === 'price') {
    return `${min ?? 0}${CURRENCY_SYMBOL} - ${max ?? '∞'}${CURRENCY_SYMBOL}`;
  }
  return `${min ?? 'Any'} - ${max ?? 'Any'}`;
}

export const FILTER_CATEGORIES: { key: FilterCategory; label: string; isSort?: boolean }[] = [
  { key: 'sort', label: 'Sort by', isSort: true },
  { key: 'format', label: 'Format' },
  { key: 'condition', label: 'Condition' },
  { key: 'genres', label: 'Genres' },
  { key: 'price', label: 'Price' },
  { key: 'year', label: 'Year' },
];

export function clearCategoryFromFilters(filters: ListingFilters, category: FilterCategory): ListingFilters {
  switch (category) {
    case 'sort':
      return { ...filters, sortBy: DEFAULT_SORT };
    case 'format':
      return { ...filters, formats: undefined };
    case 'condition':
      return { ...filters, conditions: undefined };
    case 'genres':
      return { ...filters, genres: undefined };
    case 'price':
      return { ...filters, price: undefined };
    case 'year':
      return { ...filters, year: undefined };
  }
}
