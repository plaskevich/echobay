import { PiHeartDuotone } from 'react-icons/pi';
import styled from 'styled-components';

import { ErrorMessage, InfoMessage } from '@/components/common/Message';
import { type Listing, ListingCard } from '@/components/listings/ListingCard';
import { useUserFavorites } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

interface FavoriteWithListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listings: Listing;
}

export function FavoritesPage() {
  const { user } = useAuthStore();
  const themeColors = useThemeStore((state) => state.themeColors);
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
        <InfoMessage>Loading your favorites...</InfoMessage>
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
      <Header>
        <Title>My Favorites</Title>
        <Subtitle>
          {listings.length} {listings.length === 1 ? 'item' : 'items'}
        </Subtitle>
      </Header>

      {listings.length === 0 ? (
        <EmptyState>
          <PiHeartDuotone size={60} color={themeColors.text.secondary} />
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyText>Start exploring and add items to your favorites by clicking the heart icon</EmptyText>
        </EmptyState>
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

export default FavoritesPage;

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
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
