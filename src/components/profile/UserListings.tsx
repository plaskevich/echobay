import styled from 'styled-components';

import type { Listing } from '@/api/listings';
import { LoadingState } from '@/components/common/StateDisplay';
import { ListingCard } from '@/components/listings/ListingCard';

export interface UserListingsProps {
  listings: Listing[];
  isLoading?: boolean;
  error?: unknown;
  emptyMessage: string;
  emptyAction?: React.ReactNode;
  headerExtra?: React.ReactNode;
}

export function UserListings({
  listings,
  isLoading,
  error,
  emptyMessage,
  emptyAction,
  headerExtra,
}: UserListingsProps) {
  if (isLoading) {
    return (
      <Container>
        <LoadingState />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error: {error instanceof Error ? error.message : 'An error occurred'}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      {headerExtra}
      <ListingCount data-testid="listing-count">
        {listings.length} {listings.length === 1 ? 'item' : 'items'}
      </ListingCount>

      {listings.length === 0 ? (
        <EmptyState data-testid="listings-empty">
          <EmptyMessage>{emptyMessage}</EmptyMessage>
          {emptyAction}
        </EmptyState>
      ) : (
        <Grid data-testid="listings-grid">
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

const ListingCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  font-size: 0.875rem;
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
  border: 1px dashed ${(props) => props.theme.border.primary};
`;

const EmptyMessage = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.text.secondary};
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;
