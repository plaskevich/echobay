import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import type { ListingFilters } from '@/api/listings';
import { ListingCard } from '@/components/listings/ListingCard';
import { FilterBar } from '@/components/listings/filters/FilterBar';
import { hasActiveFilters } from '@/components/listings/filters/utils';
import { SearchBar } from '@/components/navigation/SearchBar';
import { useListings } from '@/queries/useListings';
import { useAuthStore } from '@/store/auth-store';

export function ListingsView() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: 'recommended' });
  const [appliedFilters, setAppliedFilters] = useState<ListingFilters>({ sortBy: 'recommended' });
  const user = useAuthStore((state) => state.user);

  const handleApply = useCallback((filtersToApply: ListingFilters) => {
    setAppliedFilters(filtersToApply);
  }, []);

  const selectedSort = appliedFilters.sortBy || 'recommended';

  const combinedFilters = useMemo(
    () => ({
      ...appliedFilters,
      sortBy: selectedSort,
      search: searchQuery || undefined,
      excludeOwnerId: user?.id,
      recommendForUserId: selectedSort === 'recommended' ? user?.id : undefined,
    }),
    [appliedFilters, searchQuery, selectedSort, user?.id]
  );

  const { data: listings = [], isLoading, error } = useListings(combinedFilters);

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
      <Grid>
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </Grid>
    );
  }

  return (
    <>
      <StickyFilters>
        <SearchWrapper>
          <SearchBar />
        </SearchWrapper>
        <FilterBar
          filters={filters}
          appliedFilters={appliedFilters}
          onFiltersChange={setFilters}
          onApply={handleApply}
        />
      </StickyFilters>
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
