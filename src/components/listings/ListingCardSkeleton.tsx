import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';
import { breakpoint } from '@/lib/theme/breakpoints';

export function ListingCardSkeleton() {
  return (
    <Card aria-hidden="true" data-testid="listing-card-skeleton">
      <ImageSkeleton />
      <ArtistSkeleton $width="55%" />
      <Skeleton $width="80%" $height="1.3125rem" />
      <Skeleton $width="35%" $height="1.125rem" />
      <PriceSkeleton $width="30%" $height="1rem" />
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

  @media (max-width: ${breakpoint.xs}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ImageSkeleton = styled(Skeleton)`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${breakpoint.xs}) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const ArtistSkeleton = styled(Skeleton)`
  height: 1.125rem;

  @media (max-width: ${breakpoint.xs}) {
    height: 1.21875rem;
  }
`;

const PriceSkeleton = styled(Skeleton)`
  margin-top: auto;
`;
