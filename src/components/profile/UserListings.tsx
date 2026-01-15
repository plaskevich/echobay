import { PiPlusCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { ListingCard } from '@/components/item/ListingCard';
import { useUserListings } from '@/queries/useListings';
import { useAuthStore } from '@/store/auth-store';

export function UserListings() {
  const user = useAuthStore((state) => state.user);
  const { data: listings = [], isLoading, error } = useUserListings(user?.id);
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container>
        <Message>Please sign in to view your listings</Message>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <SectionTitle>My Listings</SectionTitle>
        <Message>Loading...</Message>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SectionTitle>My Listings</SectionTitle>
        <ErrorMessage>Error: {error instanceof Error ? error.message : 'An error occurred'}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderRow>
        <SectionTitle>My Listings</SectionTitle>
      </HeaderRow>

      {listings.length === 0 ? (
        <EmptyState>
          <EmptyMessage>You haven't created any listings yet</EmptyMessage>
          <Button onClick={() => navigate('/items/new')} variant="primary" size="medium">
            <PiPlusCircle size={20} />
            Create Your First Listing
          </Button>
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

const Container = styled.div`
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;

const Message = styled.p`
  color: ${(props) => props.theme.text.secondary};
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.state.error};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: ${(props) => props.theme.background.secondary};
  border-radius: 0.75rem;
  border: 1px dashed ${(props) => props.theme.border.primary};
`;

const EmptyMessage = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.text.secondary};
  margin-bottom: 1.5rem;
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
