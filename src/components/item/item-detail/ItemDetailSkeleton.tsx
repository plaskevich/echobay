import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';
import { GALLERY_MAX_WIDTH } from '@/components/item/item-detail/ImageGallery';
import { breakpoint } from '@/lib/theme/breakpoints';

export function ItemDetailSkeleton() {
  return (
    <Wrapper aria-hidden="true" data-testid="item-detail-skeleton">
      <BackSkeleton />
      <Content>
        <ImageSection>
          <ImageSkeleton />
          <ThumbnailRow>
            {Array.from({ length: 4 }, (_, i) => (
              <ThumbnailSkeleton key={i} />
            ))}
          </ThumbnailRow>
        </ImageSection>
        <Details>
          {/* title + price */}
          <Skeleton $width="40%" $height="1.5rem" />
          <Skeleton $width="70%" $height="1.8rem" />
          <PriceBlock>
            <Skeleton $width="25%" $height="1.4rem" />
            <Skeleton $width="30%" $height="1rem" />
          </PriceBlock>

          {/* info grid */}
          <InfoGrid>
            {Array.from({ length: 4 }, (_, i) => (
              <InfoItem key={i}>
                <Skeleton $width="4rem" $height="1rem" />
                <Skeleton $width="6rem" $height="1.2rem" />
              </InfoItem>
            ))}
          </InfoGrid>

          {/* description */}
          <Section>
            <Skeleton $width="8rem" $height="1.5rem" />
            <Skeleton $width="100%" $height="1rem" />
            <Skeleton $width="95%" $height="1rem" />
            <Skeleton $width="82%" $height="1rem" />
          </Section>

          {/* seller */}
          <Section>
            <Skeleton $width="5rem" $height="1.5rem" />
            <SellerRow>
              <AvatarSkeleton />
              <SellerInfo>
                <Skeleton $width="7rem" $height="1.125rem" />
                <Skeleton $width="5rem" $height="1rem" />
              </SellerInfo>
            </SellerRow>
          </Section>

          <ButtonGroup>
            <Skeleton $height="2.75rem" />
            <Skeleton $height="2.75rem" />
          </ButtonGroup>
        </Details>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const BackSkeleton = styled(Skeleton)`
  width: 3.5rem;
  height: 1.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${breakpoint.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  align-items: start;

  @media (min-width: ${breakpoint.md}) {
    grid-template-columns: minmax(0, ${GALLERY_MAX_WIDTH}) minmax(0, 500px);
    justify-content: start;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${breakpoint.lg}) {
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const ImageSection = styled.div`
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) 2rem;
  gap: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  width: 100%;
  max-width: ${GALLERY_MAX_WIDTH};

  @media (max-width: ${breakpoint.sm}) {
    grid-template-columns: 1.5rem minmax(0, 1fr) 1.5rem;
    column-gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const ImageSkeleton = styled(Skeleton)`
  grid-column: 2;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const ThumbnailRow = styled.div`
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(4, 64px);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${breakpoint.xs}) {
    grid-template-columns: repeat(4, 48px);
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const ThumbnailSkeleton = styled(Skeleton)`
  width: 100%;
  height: auto;
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
  gap: ${({ theme }) => theme.spacing['2xs']};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  width: fit-content;

  @media (min-width: ${breakpoint.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xs']};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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
  gap: ${({ theme }) => theme.spacing['2xs']};
  flex: 1;
  min-width: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;
