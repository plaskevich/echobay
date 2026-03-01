import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PiCaretLeft, PiCaretRight, PiSlidersHorizontal, PiX } from 'react-icons/pi';
import styled from 'styled-components';

import type { ListingFilters } from '@/api/listings';
import { MultiSelectFilter } from '@/components/listings/filters/MultiSelectFilter';
import { RangeFilter } from '@/components/listings/filters/RangeFilter';
import { SortFilter } from '@/components/listings/filters/SortFilter';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { CURRENCY_SYMBOL } from '@/lib/constants/listings';
import { useGenres } from '@/queries/useGenres';
import { useListingFiltersStore } from '@/store/listing-filters-store';

import {
  CATEGORY_LABELS,
  DEFAULT_SORT,
  FILTER_CATEGORIES,
  type FilterCategory,
  SORT_LABELS,
  clearCategoryFromFilters,
  conditionOptions,
  formatOptions,
  formatRangeLabel,
  getActiveFilterCount,
  toGenreOptions,
} from './utils';

interface MobileFilterPanelProps {
  onApply: () => void;
}

export function MobileFilterPanel({ onApply }: MobileFilterPanelProps) {
  const { data: genres = [] } = useGenres();
  const { filters, appliedFilters, setFilters, resetFilters } = useListingFiltersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null);

  const genreOptions = toGenreOptions(genres);

  useBodyScrollLock(isOpen);

  const activeCount = getActiveFilterCount(appliedFilters);

  const openPanel = () => {
    setActiveCategory(null);
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    setActiveCategory(null);
  };

  const handleBack = () => {
    setActiveCategory(null);
  };

  const handleClearCategory = () => {
    if (!activeCategory) return;
    setFilters(clearCategoryFromFilters(filters, activeCategory));
  };

  const handleApply = () => {
    onApply();
    closePanel();
  };

  function getSummaryLabel(filters: ListingFilters, category: FilterCategory): string {
    switch (category) {
      case 'sort':
        return SORT_LABELS[filters.sortBy || DEFAULT_SORT] ?? 'Recommended';
      case 'format':
        return filters.formats?.length ? `${filters.formats.length} selected` : 'All';
      case 'condition':
        return filters.conditions?.length ? `${filters.conditions.length} selected` : 'All';
      case 'genres':
        return filters.genres?.length ? `${filters.genres.length} selected` : 'All';
      case 'price':
        return formatRangeLabel('price', filters.price);
      case 'year':
        return formatRangeLabel('year', filters.year);
    }
  }

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'sort':
        return <SortFilter />;
      case 'format':
        return <MultiSelectFilter options={formatOptions} filterKey="formats" />;
      case 'condition':
        return <MultiSelectFilter options={conditionOptions} filterKey="conditions" />;
      case 'genres':
        return (
          <MultiSelectFilter
            options={genreOptions}
            filterKey="genres"
            searchable
            searchPlaceholder="Search genres..."
          />
        );
      case 'price':
        return (
          <RangeFilter
            filterKey="price"
            placeholderMin="0.00"
            placeholderMax="0.00"
            prefixLabel={CURRENCY_SYMBOL}
            errorMessage="Min price must be less than max"
          />
        );
      case 'year':
        return (
          <RangeFilter
            filterKey="year"
            placeholderMin="1900"
            placeholderMax="2026"
            errorMessage="Start year must be before end year"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MobileFilterButton onClick={openPanel} $active={activeCount > 0} data-testid="mobile-filter-button">
        <PiSlidersHorizontal />
        Filters
        {activeCount > 0 && <Badge>{activeCount}</Badge>}
      </MobileFilterButton>

      {isOpen &&
        createPortal(
          <Overlay>
            <Panel>
              <Header>
                {activeCategory ? (
                  <HeaderIconButton onClick={handleBack} aria-label="Back">
                    <PiCaretLeft />
                  </HeaderIconButton>
                ) : (
                  <HeaderIconButton onClick={closePanel} aria-label="Close">
                    <PiX />
                  </HeaderIconButton>
                )}
                <HeaderTitle>{activeCategory ? CATEGORY_LABELS[activeCategory] : 'Filter'}</HeaderTitle>
                {activeCategory ? (
                  <HeaderAction onClick={handleClearCategory}>Clear</HeaderAction>
                ) : (
                  <HeaderAction onClick={resetFilters}>Clear all</HeaderAction>
                )}
              </Header>

              <Content>
                {activeCategory === null ? (
                  <CategoryList>
                    {FILTER_CATEGORIES.map((cat) => (
                      <CategoryRow key={cat.key} onClick={() => setActiveCategory(cat.key)}>
                        <CategoryLabel>{cat.label}</CategoryLabel>
                        <CategoryValueRow>
                          <CategoryValue $isSort={cat.isSort}>{getSummaryLabel(filters, cat.key)}</CategoryValue>
                          <PiCaretRight />
                        </CategoryValueRow>
                      </CategoryRow>
                    ))}
                  </CategoryList>
                ) : (
                  renderCategoryContent()
                )}
              </Content>

              <Footer>
                <ShowResultsButton onClick={handleApply} data-testid="mobile-filter-apply">
                  Show results
                </ShowResultsButton>
              </Footer>
            </Panel>
          </Overlay>,
          document.body
        )}
    </>
  );
}

const MobileFilterButton = styled.button<{ $active?: boolean }>`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${({ theme, $active }) => ($active ? theme.primary.main : theme.border.primary)};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background-color: ${({ theme, $active }) => ($active ? theme.primary.light : theme.background.primary)};
    color: ${({ theme, $active }) => ($active ? theme.primary.main : theme.text.primary)};
    font-size: 0.875rem;
    white-space: nowrap;
    width: fit-content;
    align-self: flex-end;

    svg {
      font-size: 1rem;
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.primary.main};
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.4);
`;

const Panel = styled.div`
  position: fixed;
  inset: 0;
  z-index: 201;
  background-color: ${({ theme }) => theme.background.primary};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  flex-shrink: 0;
`;

const HeaderIconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  padding: 0.25rem;
  font-size: 1.25rem;
  min-width: 2rem;
`;

const HeaderTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const HeaderAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem;
  min-width: 2rem;
  text-align: right;

  &:hover {
    color: ${({ theme }) => theme.primary.main};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  flex-shrink: 0;
`;

const ShowResultsButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.primary.main};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary.hover};
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  cursor: pointer;

  &:active {
    background-color: ${({ theme }) => theme.background.tertiary};
  }
`;

const CategoryLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const CategoryValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;

  svg {
    font-size: 0.875rem;
  }
`;

const CategoryValue = styled.span<{ $isSort?: boolean }>`
  color: ${({ theme, $isSort }) => ($isSort ? theme.primary.main : theme.text.secondary)};
`;
