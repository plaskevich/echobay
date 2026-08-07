import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';

export function ListingCardSkeleton() {
  return (
    <Card aria-hidden="true" data-testid="listing-card-skeleton">
      <ImageSkeleton />
      <ArtistSkeleton width="55%" />
      <Skeleton width="80%" height="1.3125rem" />
      <Skeleton width="35%" height="1.125rem" />
      <PriceSkeleton width="30%" height="1rem" />
    </Card>
  );
}

const Card = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 0.1rem;

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ImageSkeleton = styled(Skeleton)`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
`;

const ArtistSkeleton = styled(Skeleton)`
  height: 1.125rem;

  @media (max-width: 480px) {
    height: 1.21875rem;
  }
`;

const PriceSkeleton = styled(Skeleton)`
  margin-top: auto;
`;
