import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';

export function ItemDetailSkeleton() {
  return (
    <Content aria-hidden="true" data-testid="item-detail-skeleton">
      <ImageSkeleton />
      <Details>
        <Skeleton width="70%" height="2rem" />
        <Skeleton width="45%" height="1.5rem" />
        <Skeleton width="30%" height="1.875rem" />
        <Gap />
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="95%" height="1rem" />
        <Skeleton width="82%" height="1rem" />
        <Gap />
        <Skeleton height="2.75rem" />
      </Details>
    </Content>
  );
}

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 300px) 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 380px) 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const ImageSkeleton = styled(Skeleton)`
  width: 100%;
  height: auto;
  max-width: 480px;
  aspect-ratio: 1 / 1;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const Gap = styled.div`
  height: ${({ theme }) => theme.spacing.xs};
`;
