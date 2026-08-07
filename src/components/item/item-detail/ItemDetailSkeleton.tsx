import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';

export function ItemDetailSkeleton() {
  return (
    <Content aria-hidden="true" data-testid="item-detail-skeleton">
      <ImageSkeleton />
      <Details>
        {/* title + price */}
        <Skeleton width="40%" height="1.5rem" />
        <Skeleton width="70%" height="1.8rem" />
        <PriceBlock>
          <Skeleton width="25%" height="1.4rem" />
          <Skeleton width="30%" height="1rem" />
        </PriceBlock>

        {/* info grid */}
        <InfoGrid>
          {Array.from({ length: 4 }, (_, i) => (
            <InfoItem key={i}>
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="6rem" height="1.2rem" />
            </InfoItem>
          ))}
        </InfoGrid>

        {/* description */}
        <Section>
          <Skeleton width="8rem" height="1.5rem" />
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="95%" height="1rem" />
          <Skeleton width="82%" height="1rem" />
        </Section>

        {/* seller */}
        <Section>
          <Skeleton width="5rem" height="1.5rem" />
          <SellerRow>
            <AvatarSkeleton />
            <SellerInfo>
              <Skeleton width="7rem" height="1.125rem" />
              <Skeleton width="5rem" height="1rem" />
            </SellerInfo>
          </SellerRow>
        </Section>

        <ButtonGroup>
          <Skeleton height="2.75rem" />
          <Skeleton height="2.75rem" />
        </ButtonGroup>
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
    gap: 2.5rem;
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
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.5rem;
  width: fit-content;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SellerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const AvatarSkeleton = styled(Skeleton)`
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 50%;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;
