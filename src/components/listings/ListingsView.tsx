import { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import type { Listing } from '@/api/listings';
import { Pagination } from '@/components/common/Pagination';
import { Skeleton } from '@/components/common/Skeleton';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingCardSkeleton } from '@/components/listings/ListingCardSkeleton';
import { FilterBar } from '@/components/listings/filters/FilterBar';
import { hasActiveFilters } from '@/components/listings/filters/utils';
import { SearchBar } from '@/components/navigation/SearchBar';
import { usePaginatedSearchParams } from '@/hooks/usePaginatedSearchParams';
import { useListings } from '@/queries/useListings';
import { useAuthStore } from '@/store/auth-store';
import { useListingFiltersStore } from '@/store/listing-filters-store';
import { useRecentlyViewedStore } from '@/store/recently-viewed-store';

export function ListingsView() {
  const user = useAuthStore((s) => s.user);
  const { appliedFilters } = useListingFiltersStore();
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.ids);
  const selectedSort = appliedFilters.sortBy || 'recommended';

  const { searchQuery, currentPage, currentPageSize, setPage, handlePageSizeChange } =
    usePaginatedSearchParams(appliedFilters);

  const combinedFilters = useMemo(
    () => ({
      ...appliedFilters,
      sortBy: selectedSort,
      search: searchQuery || undefined,
      excludeOwnerId: user?.id,
      recommendForUserId: selectedSort === 'recommended' ? user?.id : undefined,
      recentViewIds:
        !user?.id && selectedSort === 'recommended' && recentlyViewedIds.length > 0 ? recentlyViewedIds : undefined,
      page: currentPage,
      pageSize: currentPageSize,
    }),
    [appliedFilters, selectedSort, searchQuery, user?.id, recentlyViewedIds, currentPage, currentPageSize]
  );

  const { data, isLoading, isPlaceholderData, error } = useListings(combinedFilters);
  const listings = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  // keepPreviousData serves the old page while the new one loads — skeleton it instead of showing stale items.
  const showSkeleton = isLoading || isPlaceholderData;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setPage(totalPages, true);
    }
  }, [currentPage, totalPages, setPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
      if (clamped === currentPage) return;
      setPage(clamped);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPage, totalPages, setPage]
  );

  const startIndex = total > 0 ? Math.min((currentPage - 1) * currentPageSize + 1, total) : 0;
  const endIndex = Math.min(currentPage * currentPageSize, total);

  return (
    <>
      <StickyFilters>
        <SearchWrapper>
          <SearchBar />
        </SearchWrapper>
        <FilterBar />
      </StickyFilters>

      {showSkeleton ? (
        <SummarySkeleton $width="9rem" />
      ) : (
        total > 0 && (
          <ItemsSummary>
            {startIndex}-{endIndex} of {total} items
          </ItemsSummary>
        )
      )}

      {error ? (
        <StatusText $error>Error: {error instanceof Error ? error.message : 'An error occurred'}</StatusText>
      ) : !showSkeleton && listings.length === 0 ? (
        <StatusText>
          {searchQuery.trim() || hasActiveFilters(appliedFilters)
            ? 'No items match your filters.'
            : 'No listings found.'}
        </StatusText>
      ) : (
        <>
          {showSkeleton ? (
            <Grid aria-busy="true" data-testid="listings-loading">
              {Array.from({ length: currentPageSize || 12 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </Grid>
          ) : (
            <Grid>
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as Listing} />
              ))}
            </Grid>
          )}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            pageSize={currentPageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </>
  );
}

const StickyFilters = styled.div`
  position: sticky;
  top: 4rem;
  z-index: 40;
  background-color: ${(props) => props.theme.background.primary};
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 1rem calc(50vw - 50%);

  @media (max-width: 768px) {
    margin: 0 -0.75rem;
    padding: 1rem 0.75rem 0.75rem;
  }

  @media (min-width: 640px) {
    top: 5rem;
  }
`;

const SearchWrapper = styled.div`
  padding: 0.25rem 0 0.75rem 0;

  @media (min-width: 768px) {
    display: none;
  }
`;

const ItemsSummary = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  padding-left: ${({ theme }) => theme.spacing.xs};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 600;
  font-size: 0.875rem;
`;

const SummarySkeleton = styled(Skeleton)`
  height: 1.3125rem;
  margin-left: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatusText = styled.p<{ $error?: boolean }>`
  color: ${({ theme, $error }) => ($error ? theme.state.error : theme.text.secondary)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: 0.1rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;
