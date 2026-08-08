import { useEffect, useMemo, useRef, useState } from 'react';

import type { ListingFilters } from '@/api/listings';
import { useListingFiltersStore } from '@/store/listing-filters-store';

import { Checkbox, CheckboxItem, CheckboxList, SearchInput, SearchInputWrapper } from './styles';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  filterKey: keyof ListingFilters;
  options: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function MultiSelectFilter({
  options,
  searchable,
  searchPlaceholder = 'Search...',
  filterKey,
}: MultiSelectFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { filters, setFilters } = useListingFiltersStore();

  useEffect(() => {
    if (searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchable]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleToggle = (value: string) => {
    const currentValues = Array.isArray(filters[filterKey]) ? (filters[filterKey] as string[]) : [];
    setFilters({
      ...filters,
      [filterKey]: currentValues.includes(value) ? currentValues.filter((v) => v !== value) : [...currentValues, value],
    });
  };

  return (
    <>
      {searchable && (
        <SearchInputWrapper>
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="filter-search-input"
          />
        </SearchInputWrapper>
      )}
      <CheckboxList>
        {filteredOptions.map((opt) => {
          const isChecked = Array.isArray(filters[filterKey])
            ? (filters[filterKey] as string[]).includes(opt.value)
            : false;
          return (
            <CheckboxItem key={opt.value} $checked={isChecked} onClick={() => handleToggle(opt.value)}>
              <span>{opt.label}</span>
              <Checkbox $checked={isChecked}>{isChecked && <i className="hn hn-check" aria-hidden />}</Checkbox>
            </CheckboxItem>
          );
        })}
        {searchable && filteredOptions.length === 0 && (
          <CheckboxItem as="div" $empty>
            <span>No results found</span>
          </CheckboxItem>
        )}
      </CheckboxList>
    </>
  );
}
