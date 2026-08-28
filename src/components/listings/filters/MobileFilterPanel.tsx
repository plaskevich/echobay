import { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import type { ListingFilters } from '@/api/listings';
import { MultiSelectFilter } from '@/components/listings/filters/MultiSelectFilter';
import { RangeFilter } from '@/components/listings/filters/RangeFilter';
import { SortFilter } from '@/components/listings/filters/SortFilter';
import { ApplyButtonWrapper, DropdownApplyButton, FilterButton } from '@/components/listings/filters/styles';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { CURRENCY_SYMBOL } from '@/lib/constants/listings';
import { breakpoint } from '@/lib/theme/breakpoints';
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
        <i className="hn hn-filter" aria-hidden />
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
                    <i className="hn hn-angle-left" aria-hidden />
                  </HeaderIconButton>
                ) : (
                  <HeaderIconButton onClick={closePanel} aria-label="Close">
                    <i className="hn hn-times" aria-hidden />
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
                          <i className="hn hn-angle-right" aria-hidden />
                        </CategoryValueRow>
                      </CategoryRow>
                    ))}
                  </CategoryList>
                ) : (
                  renderCategoryContent()
                )}
              </Content>

              <ApplyButtonWrapper>
                <DropdownApplyButton onClick={handleApply} data-testid="mobile-filter-apply">
                  Show results
                </DropdownApplyButton>
              </ApplyButtonWrapper>
            </Panel>
          </Overlay>,
          document.body
        )}
    </>
  );
}

const MobileFilterButton = styled(FilterButton)`
  display: none;

  @media (max-width: ${breakpoint.sm}) {
    display: flex;
    gap: 0.4rem;
    width: fit-content;
    align-self: flex-end;

    i {
      display: inline-block;
      font-size: ${({ theme }) => theme.fontSize.base};
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
  background-color: ${({ theme }) => theme.black.main};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: ${({ theme }) => theme.overlay.dark};
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
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  flex-shrink: 0;
`;

const HeaderIconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['2xs']};
  font-size: ${({ theme }) => theme.fontSize.xl};
  min-width: 2rem;
`;

const HeaderTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
`;

const HeaderAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing['2xs']};
  min-width: 2rem;
  text-align: right;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  cursor: pointer;

  &:active {
    background-color: ${({ theme }) => theme.background.tertiary};
  }
`;

const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`;

const CategoryValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};

  i {
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
`;

const CategoryValue = styled.span<{ $isSort?: boolean }>`
  color: ${({ theme, $isSort }) => ($isSort ? theme.text.primary : theme.text.secondary)};
  font-weight: ${({ $isSort, theme }) => ($isSort ? theme.fontWeight.semibold : theme.fontWeight.regular)};
`;
