import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { type PageSize, Pagination } from '@/components/common/Pagination';
import { type Listing, ListingCard } from '@/components/listings/ListingCard';
import { FilterBar } from '@/components/listings/filters/FilterBar';
import { hasActiveFilters } from '@/components/listings/filters/utils';
import { SearchBar } from '@/components/navigation/SearchBar';
import { useListings } from '@/queries/useListings';
import { useAuthStore } from '@/store/auth-store';
import { useListingFiltersStore } from '@/store/listing-filters-store';

export function ListingsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const user = useAuthStore((state) => state.user);
  const { appliedFilters } = useListingFiltersStore();

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentPageSize = (Number(searchParams.get('pageSize')) || 25) as PageSize;

  const resetToFirstPage = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const hasAppliedOnceRef = useRef(false);
  useEffect(() => {
    if (!hasAppliedOnceRef.current) {
      hasAppliedOnceRef.current = true;
      return;
    }
    resetToFirstPage();
  }, [appliedFilters, resetToFirstPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(page));
        return next;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (size: PageSize) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('pageSize', String(size));
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const selectedSort = appliedFilters.sortBy || 'recommended';

  const combinedFilters = useMemo(
    () => ({
      ...appliedFilters,
      sortBy: selectedSort,
      search: searchQuery || undefined,
      excludeOwnerId: user?.id,
      recommendForUserId: selectedSort === 'recommended' ? user?.id : undefined,
      page: currentPage,
      pageSize: currentPageSize,
    }),
    [appliedFilters, searchQuery, selectedSort, user?.id, currentPage, currentPageSize]
  );

  const { data, isLoading, error } = useListings(combinedFilters);
  const listings = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const startIndex = total > 0 ? Math.min((currentPage - 1) * currentPageSize + 1, total) : 0;
  const endIndex = Math.min(currentPage * currentPageSize, total);

  let content: React.ReactNode;

  if (isLoading) {
    content = <LoadingText>Loading listings...</LoadingText>;
  } else if (error) {
    content = <ErrorText>Error: {error instanceof Error ? error.message : 'An error occurred'}</ErrorText>;
  } else if (listings.length === 0) {
    content = (
      <EmptyText>
        {searchQuery.trim() || hasActiveFilters(appliedFilters) ? 'No items match your filters.' : 'No listings found.'}
      </EmptyText>
    );
  } else {
    content = (
      <>
        <Grid>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing as Listing} />
          ))}
        </Grid>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={total}
          pageSize={currentPageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </>
    );
  }

  return (
    <>
      <StickyFilters>
        <SearchWrapper>
          <SearchBar />
        </SearchWrapper>
        <FilterBar />
      </StickyFilters>
      {total > 0 && (
        <ItemsSummary>
          {startIndex}-{endIndex} of {total} items
        </ItemsSummary>
      )}
      {content}
    </>
  );
}

const StickyFilters = styled.div`
  position: sticky;
  top: 3rem;
  z-index: 40;
  background-color: ${(props) => props.theme.background.primary};
  padding: 1rem 0;

  @media (max-width: 768px) {
    margin: 0 -0.75rem;
    padding: 1rem 0.75rem 0.75rem;
  }

  @media (min-width: 640px) {
    top: 4rem;
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
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
`;

const LoadingText = styled.p`
  color: ${(props) => props.theme.text.secondary};
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.state.error};
`;

const EmptyText = styled.p`
  color: ${(props) => props.theme.text.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding-top: 0.1rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;
