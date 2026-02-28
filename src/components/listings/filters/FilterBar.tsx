import { useRef, useState } from 'react';
import { PiX } from 'react-icons/pi';
import styled from 'styled-components';

import { useClickOutside } from '@/hooks/useClickOutside';
import { CONDITION_OPTIONS, CURRENCY_SYMBOL, FORMAT_OPTIONS } from '@/lib/constants/listings';
import { useGenres } from '@/queries/useGenres';
import { useListingFiltersStore } from '@/store/listing-filters-store';

import { MultiSelectFilter } from './MultiSelectFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { SortFilter } from './SortFilter';

const formatOptions = FORMAT_OPTIONS.filter((opt) => opt.value !== '').map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

const conditionOptions = CONDITION_OPTIONS.filter((opt) => opt.value !== '').map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

export function FilterBar({ onApply }: { onApply?: () => void }) {
  const { data: genres = [] } = useGenres();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const filters = useListingFiltersStore((state) => state.filters);
  const appliedFilters = useListingFiltersStore((state) => state.appliedFilters);
  const setFilters = useListingFiltersStore((state) => state.setFilters);
  const setAppliedFilters = useListingFiltersStore((state) => state.setAppliedFilters);
  const resetFilters = useListingFiltersStore((state) => state.resetFilters);

  const genreOptions = genres.map((g) => ({ value: g.id, label: g.name }));

  const closeDropdown = () => setOpenDropdown(null);
  useClickOutside(containerRef, closeDropdown);
  const selectedSort = filters.sortBy || 'recommended';
  const appliedSort = appliedFilters.sortBy || 'recommended';

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const removeFilter = (type: 'formats' | 'conditions' | 'genres', value: string) => {
    const currentDraft = filters[type];
    const currentApplied = appliedFilters[type];
    const updatedDraft = currentDraft?.filter((v) => v !== value);
    const updatedApplied = currentApplied?.filter((v) => v !== value);
    const newDraft = { ...filters, [type]: updatedDraft?.length ? updatedDraft : undefined };
    const newApplied = { ...appliedFilters, [type]: updatedApplied?.length ? updatedApplied : undefined };
    setFilters(newDraft);
    setAppliedFilters(newApplied);
    onApply?.();
  };

  const removePriceRange = () => {
    const newDraft = { ...filters };
    delete newDraft.minPrice;
    delete newDraft.maxPrice;
    const newApplied = { ...appliedFilters };
    delete newApplied.minPrice;
    delete newApplied.maxPrice;
    setFilters(newDraft);
    setAppliedFilters(newApplied);
    onApply?.();
  };

  const formatPills =
    appliedFilters.formats?.map((value) => ({
      id: `format-${value}`,
      label: formatOptions.find((o) => o.value === value)?.label || value,
      onRemove: () => removeFilter('formats', value),
    })) || [];

  const conditionPills =
    appliedFilters.conditions?.map((value) => ({
      id: `condition-${value}`,
      label: conditionOptions.find((o) => o.value === value)?.label || value,
      onRemove: () => removeFilter('conditions', value),
    })) || [];

  const genrePills =
    appliedFilters.genres?.map((value) => ({
      id: `genre-${value}`,
      label: genreOptions.find((o) => o.value === value)?.label || value,
      onRemove: () => removeFilter('genres', value),
    })) || [];

  const pricePill =
    appliedFilters.minPrice !== undefined || appliedFilters.maxPrice !== undefined
      ? {
          id: 'price-range',
          label: `${appliedFilters.minPrice ?? 0}${CURRENCY_SYMBOL} - ${appliedFilters.maxPrice ?? '∞'}${CURRENCY_SYMBOL}`,
          onRemove: removePriceRange,
        }
      : null;

  const activePills = [...formatPills, ...conditionPills, ...genrePills, ...(pricePill ? [pricePill] : [])];
  const isActive = activePills.length > 0;

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setOpenDropdown(null);
    onApply?.();
  };

  const handleClearAll = () => {
    resetFilters();
    setOpenDropdown(null);
    onApply?.();
  };

  return (
    <Container ref={containerRef}>
      <FiltersRow>
        <SortFilter
          value={selectedSort}
          appliedValue={appliedSort}
          onChange={(value) => setFilters({ ...filters, sortBy: value })}
          onApply={handleApply}
          isOpen={openDropdown === 'sort'}
          onToggle={() => toggleDropdown('sort')}
        />

        <MultiSelectFilter
          label="Format"
          options={formatOptions}
          selectedValues={filters.formats || []}
          appliedValues={appliedFilters.formats || []}
          onChange={(values) => setFilters({ ...filters, formats: values.length > 0 ? values : undefined })}
          onApply={handleApply}
          isOpen={openDropdown === 'format'}
          onToggle={() => toggleDropdown('format')}
        />

        <MultiSelectFilter
          label="Condition"
          options={conditionOptions}
          selectedValues={filters.conditions || []}
          appliedValues={appliedFilters.conditions || []}
          onChange={(values) => setFilters({ ...filters, conditions: values.length > 0 ? values : undefined })}
          onApply={handleApply}
          isOpen={openDropdown === 'condition'}
          onToggle={() => toggleDropdown('condition')}
        />

        <MultiSelectFilter
          label="Genres"
          options={genreOptions}
          selectedValues={filters.genres || []}
          appliedValues={appliedFilters.genres || []}
          onChange={(values) => setFilters({ ...filters, genres: values.length > 0 ? values : undefined })}
          onApply={handleApply}
          isOpen={openDropdown === 'genres'}
          onToggle={() => toggleDropdown('genres')}
          searchable
        />

        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={(min, max) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
          onApply={handleApply}
          isOpen={openDropdown === 'price'}
          onToggle={() => toggleDropdown('price')}
        />

        {(isActive || appliedSort !== 'recommended') && (
          <ClearAllButton onClick={handleClearAll} data-testid="clear-filters-button">
            <PiX />
            Clear filters
          </ClearAllButton>
        )}
      </FiltersRow>

      {isActive && (
        <ActiveFiltersRow>
          {activePills.map((pill) => (
            <FilterPill key={pill.id}>
              <span>{pill.label}</span>
              <PillRemoveButton onClick={pill.onRemove} aria-label={`Remove ${pill.label} filter`}>
                <PiX size={12} />
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
  margin-bottom: 0.5rem;
`;

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.state.error};
    background-color: ${({ theme }) => theme.background.secondary};
  }
`;

const ActiveFiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const FilterPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem 0.375rem 0.75rem;
  background-color: ${({ theme }) => theme.primary.light};
  color: ${({ theme }) => theme.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.border.primary};
  font-size: 0.8125rem;
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
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: transparent;
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.primary.main};
  }
`;
