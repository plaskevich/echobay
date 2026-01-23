import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { ListingCard } from '@/components/item/ListingCard';
import { useListings } from '@/queries/useListings';

export function CatalogView() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { data: listings = [], isLoading, error } = useListings(searchQuery);

  if (isLoading) {
    return (
      <>
        <Title>Items</Title>
        <LoadingText>Loading listings...</LoadingText>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Title>Items</Title>
        <ErrorText>Error: {error instanceof Error ? error.message : 'An error occurred'}</ErrorText>
      </>
    );
  }

  return (
    <>
      <Title>Items</Title>

      {listings.length === 0 ? (
        <EmptyText>{searchQuery.trim() ? 'No items match your search.' : 'No listings found.'}</EmptyText>
      ) : (
        <Grid>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </Grid>
      )}
    </>
  );
}

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${(props) => props.theme.text.primary};
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
`;
