import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';

export function ListingCardSkeleton() {
  return (
    <Card aria-hidden="true" data-testid="listing-card-skeleton">
      <ImageSkeleton radius="md" />
      <Skeleton width="55%" height="0.875rem" />
      <Skeleton width="80%" height="1rem" />
      <Skeleton width="35%" height="0.75rem" />
      <PriceSkeleton width="30%" height="1rem" />
    </Card>
  );
}

const Card = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ImageSkeleton = styled(Skeleton)`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PriceSkeleton = styled(Skeleton)`
  margin-top: auto;
`;
