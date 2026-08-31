import styled from 'styled-components';

import type { Listing } from '@/api/listings';
import { ErrorMessage } from '@/components/common/Message';
import { PageContainer as Container } from '@/components/common/PageContainer';
import { PageTitle } from '@/components/common/PageTitle';
import { EmptyState, LoadingState } from '@/components/common/StateDisplay';
import { ListingCard } from '@/components/listings/ListingCard';
import { breakpoint } from '@/lib/theme/breakpoints';
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
        <EmptyState
          data-testid="favorites-empty"
          icon={<i className="hn hn-heart" aria-hidden />}
          title="No favorites yet"
          message="Start exploring and add items to your favorites by clicking the heart icon"
        />
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

const Subtitle = styled.p`
  margin-top: 0.2rem;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${breakpoint.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${breakpoint.xs}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;
