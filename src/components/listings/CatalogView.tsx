import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { supabase } from '@/lib/supabase';

import { type Listing, ListingCard } from './ListingCard';

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

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

export function CatalogView() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  if (loading) {
    return (
      <Container>
        <Title>Items</Title>
        <LoadingText>Loading listings...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Items</Title>
        <ErrorText>Error: {error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Items</Title>

      {listings.length === 0 ? (
        <EmptyText>No listings found.</EmptyText>
      ) : (
        <Grid>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </Grid>
      )}
    </Container>
  );
}
