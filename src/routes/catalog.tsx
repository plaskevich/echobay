import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { createFileRoute } from '@tanstack/react-router';

import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/catalog')({
  component: Catalog,
});

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  created_at: string;
  user_id: string;
}

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${(props) => props.theme.text};
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
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 ${(props) => props.theme.shadow};
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px ${(props) => props.theme.shadow.medium};
    transform: translateY(-2px);
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${(props) => props.theme.text};
`;

const Description = styled.p`
  color: ${(props) => props.theme.text.secondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.state.success};
  margin-bottom: 0.5rem;
`;

const DateText = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.tertiary};
`;

function Catalog() {
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
            <Card key={listing.id}>
              {listing.image_url && <ListingImage src={listing.image_url} alt={listing.title} />}
              <ListingTitle>{listing.title}</ListingTitle>
              <Description>{listing.description}</Description>
              <Price>${listing.price.toFixed(2)}</Price>
              <DateText>Listed: {new Date(listing.created_at).toLocaleDateString()}</DateText>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}
