import styled from 'styled-components';

import { ErrorMessage, InfoMessage } from '@/components/common/Message';
import { PageTitle } from '@/components/common/PageTitle';
import { LoadingState } from '@/components/common/StateDisplay';
import { type Listing, ListingCard } from '@/components/listings/ListingCard';
import { useUserFavorites } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';

interface FavoriteWithListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listings: Listing;
}

export function FavoritesPage() {
  const { user } = useAuthStore();
  const { data: favorites = [], isLoading, error } = useUserFavorites(user?.id);

  if (!user) {
    return (
      <Container>
        <InfoMessage>Please log in to view your favorites</InfoMessage>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading favorites" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Failed to load favorites. Please try again later</ErrorMessage>
      </Container>
    );
  }

  const listings = (favorites as FavoriteWithListing[]).map((fav) => fav.listings).filter(Boolean);

  return (
    <Container>
      <PageTitle>My Favorites</PageTitle>
      <Subtitle data-testid="favorites-count">
        {listings.length} {listings.length === 1 ? 'item' : 'items'}
      </Subtitle>

      {listings.length === 0 ? (
        <EmptyState data-testid="favorites-empty">
          <EmptyIcon className="hn hn-heart" aria-hidden />
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyText>Start exploring and add items to your favorites by clicking the heart icon</EmptyText>
        </EmptyState>
      ) : (
        <Grid data-testid="favorites-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default FavoritesPage;

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 2rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const Subtitle = styled.p`
  margin-top: 0.2rem;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  font-size: 0.875rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  @media (max-width: 640px) {
    padding: 3rem 1rem;
  }
`;

const EmptyIcon = styled.i`
  font-size: 3.75rem;
  line-height: 1;
  color: ${(props) => props.theme.text.secondary};
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 2rem 0 0.5rem 0;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  max-width: 400px;
`;
