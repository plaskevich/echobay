import styled from 'styled-components';

import { formatPrice } from '@/lib/utils';

interface ListingHeaderProps {
  artist?: string;
  title: string;
  price: number;
  shippingPrice?: number | null;
}

export function ListingHeader({ artist, title, price, shippingPrice }: ListingHeaderProps) {
  return (
    <>
      <TitleSection>
        <Artist data-testid="artist">{artist}</Artist>
        <Title data-testid="title">{title}</Title>
      </TitleSection>
      <PriceSection>
        <Price data-testid="listing-price">{formatPrice(price)}</Price>
        {shippingPrice != null && shippingPrice > 0 ? (
          <ShippingPrice data-testid="listing-shipping">+ {formatPrice(shippingPrice)} shipping</ShippingPrice>
        ) : (
          <ShippingPrice data-testid="listing-shipping">Free shipping</ShippingPrice>
        )}
      </PriceSection>
    </>
  );
}

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Artist = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: -0.5rem;
`;

const Price = styled.p`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const ShippingPrice = styled.p`
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: 500;
  color: ${({ theme }) => theme.text.muted};
  margin: 0;
`;
