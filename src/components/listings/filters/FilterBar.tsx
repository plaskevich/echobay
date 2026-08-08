import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import type { ListingFilters } from '@/api/listings';
import DesktopFilter from '@/components/listings/filters/DesktopFilter';
import { MobileFilterPanel } from '@/components/listings/filters/MobileFilterPanel';
import { RangeFilter } from '@/components/listings/filters/RangeFilter';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CURRENCY_SYMBOL } from '@/lib/constants/listings';
import { useGenres } from '@/queries/useGenres';
import { useListingFiltersStore } from '@/store/listing-filters-store';

import { MultiSelectFilter } from './MultiSelectFilter';
import { SortFilter } from './SortFilter';
import {
  DEFAULT_SORT,
  type FilterCategory,
  conditionOptions,
  formatOptions,
  formatRangeLabel,
  toGenreOptions,
  toOptionLabelMap,
} from './utils';

export function FilterBar() {
  const { data: genres = [] } = useGenres();
  const [openDropdown, setOpenDropdown] = useState<FilterCategory | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { filters, appliedFilters, setAppliedFilters, resetFilters } = useListingFiltersStore();

  const genreOptions = toGenreOptions(genres);
  const genreLabelMap = useMemo(() => toOptionLabelMap(genreOptions), [genreOptions]);
  const formatLabelMap = useMemo(() => toOptionLabelMap(formatOptions), []);
  const conditionLabelMap = useMemo(() => toOptionLabelMap(conditionOptions), []);

  const multiSelectConfigs = [
    {
      key: 'formats' as const,
      dropdown: 'format' as const,
      label: 'Format',
      options: formatOptions,
      labelMap: formatLabelMap,
    },
    {
      key: 'conditions' as const,
      dropdown: 'condition' as const,
      label: 'Condition',
      options: conditionOptions,
      labelMap: conditionLabelMap,
    },
    {
      key: 'genres' as const,
      dropdown: 'genres' as const,
      label: 'Genres',
      options: genreOptions,
      labelMap: genreLabelMap,
      searchable: true,
    },
  ];

  const rangeConfigs = [
    {
      key: 'year' as const,
      minKey: 'year.min' as const,
      maxKey: 'year.max' as const,
      label: 'Year',
      placeholderMin: '1900',
      placeholderMax: '2026',
      errorMessage: 'Start year must be before end year',
      inputMin: 0,
    },
    {
      key: 'price' as const,
      minKey: 'price.min' as const,
      maxKey: 'price.max' as const,
      label: 'Price',
      placeholderMin: '0.00',
      placeholderMax: '0.00',
      prefixLabel: CURRENCY_SYMBOL,
      errorMessage: 'Min price must be less than max',
      inputMin: 0,
    },
  ];

  const closeDropdown = () => setOpenDropdown(null);
  useClickOutside(containerRef, closeDropdown);
  const appliedSort = appliedFilters.sortBy || DEFAULT_SORT;

  const toggleDropdown = (name: FilterCategory) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const removeMultiValue = (key: 'formats' | 'conditions' | 'genres', value: string) => {
    const stripValue = (source: ListingFilters) => {
      const nextValues = source[key]?.filter((v) => v !== value);
      return { ...source, [key]: nextValues?.length ? nextValues : undefined };
    };

    setAppliedFilters(stripValue(appliedFilters));
  };

  const removeRange = (key: keyof ListingFilters) => {
    const stripRange = (source: ListingFilters) => {
      const next = { ...source } as ListingFilters;
      delete (next[key] as { min?: number; max?: number }).min;
      delete (next[key] as { min?: number; max?: number }).max;
      return next;
    };

    setAppliedFilters(stripRange(appliedFilters));
  };

  const multiSelectPills = multiSelectConfigs.flatMap((config) => {
    const values = appliedFilters[config.key] || [];
    return values.map((value) => ({
      id: `${config.key}-${value}`,
      label: config.labelMap[value] || value,
      onRemove: () => removeMultiValue(config.key, value),
    }));
  });

  const rangePills = rangeConfigs
    .map((range) => {
      const rangeValue = appliedFilters[range.key];
      const label = formatRangeLabel(range.key, rangeValue);
      if (label === 'All') return null;

      return {
        id: `${range.key}-range`,
        label,
        onRemove: () => removeRange(range.key as keyof ListingFilters),
      };
    })
    .filter(Boolean) as { id: string; label: string; onRemove: () => void }[];

  const activePills = [...multiSelectPills, ...rangePills];
  const isActive = activePills.length > 0;

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setOpenDropdown(null);
  };

  const handleClearAll = () => {
    resetFilters();
  };

  return (
    <Container ref={containerRef}>
      <MobileFilterPanel onApply={handleApply} />
      <DesktopFiltersRow>
        <DesktopFilter
          label="Sort by"
          hasSelection={appliedSort !== 'recommended'}
          onToggle={() => toggleDropdown('sort')}
          isOpen={openDropdown === 'sort'}
          onApply={handleApply}
          testId="sort-filter"
        >
          <SortFilter />
        </DesktopFilter>

        {multiSelectConfigs.map((config) => (
          <DesktopFilter
            key={config.key}
            label={config.label}
            hasSelection={(appliedFilters[config.key]?.length ?? 0) > 0}
            onToggle={() => toggleDropdown(config.dropdown)}
            isOpen={openDropdown === config.dropdown}
            onApply={handleApply}
          >
            <MultiSelectFilter options={config.options} filterKey={config.key} searchable={config.searchable} />
          </DesktopFilter>
        ))}
        {rangeConfigs.map((range) => (
          <DesktopFilter
            key={range.key}
            label={range.label}
            hasSelection={appliedFilters[range.key]?.min !== undefined && appliedFilters[range.key]?.max !== undefined}
            onToggle={() => toggleDropdown(range.key)}
            isOpen={openDropdown === range.key}
            onApply={handleApply}
          >
            <RangeFilter
              filterKey={range.key as keyof ListingFilters}
              placeholderMin={range.placeholderMin}
              placeholderMax={range.placeholderMax}
              prefixLabel={range.prefixLabel}
              inputMin={range.inputMin}
              errorMessage={range.errorMessage}
            />
          </DesktopFilter>
        ))}

        {(isActive || appliedSort !== 'recommended') && (
          <ClearAllButton onClick={handleClearAll} data-testid="clear-filters-button">
            <i className="hn hn-times" aria-hidden />
            Clear filters
          </ClearAllButton>
        )}
      </DesktopFiltersRow>

      {isActive && (
        <ActiveFiltersRow>
          {activePills.map((pill) => (
            <FilterPill key={pill.id}>
              <span>{pill.label}</span>
              <PillRemoveButton onClick={pill.onRemove} aria-label={`Remove ${pill.label} filter`}>
                <i className="hn hn-times" aria-hidden />
              </PillRemoveButton>
            </FilterPill>
          ))}
        </ActiveFiltersRow>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DesktopFiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 640px) {
    display: none;
  }
`;

const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.primary.main};
  }
`;

const ActiveFiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  @media (max-width: 640px) {
    display: none;
  }
`;

const FilterPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.background.elevated};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  font-size: 0.875rem;
  font-weight: 500;

  span {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const PillRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.75rem;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.primary.main};
  }
`;
