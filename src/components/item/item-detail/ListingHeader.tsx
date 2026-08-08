import styled from 'styled-components';

import { formatPrice } from '@/lib/utils';
import { useIsFavorited, useToggleFavorite } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';

interface ListingHeaderProps {
  artist?: string;
  title: string;
  price: number;
  shippingPrice?: number | null;
  listingId: string;
  isOwner: boolean;
}

export function ListingHeader({ artist, title, price, shippingPrice, listingId, isOwner }: ListingHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const openAuthDialog = useAuthStore((state) => state.openAuthDialog);
  const { data: isFavorited = false } = useIsFavorited(user?.id, listingId);
  const { toggleFavorite, isLoading } = useToggleFavorite();

  const handleFavoriteClick = () => {
    if (!user) return openAuthDialog();
    toggleFavorite(user.id, listingId, isFavorited);
  };

  return (
    <>
      <TitleSection>
        <TitleText>
          <Artist data-testid="artist">{artist}</Artist>
          <Title data-testid="title">{title}</Title>
        </TitleText>
        {!isOwner && (
          <FavoriteButton
            onClick={handleFavoriteClick}
            $isFavorited={isFavorited}
            disabled={isLoading}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={isFavorited ? 'hn hn-heart-solid' : 'hn hn-heart'} />
          </FavoriteButton>
        )}
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const FavoriteButton = styled.button<{ $isFavorited: boolean }>`
  background: none;
  border: none;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  i {
    font-size: 1.75rem;
    color: ${({ theme, $isFavorited }) => ($isFavorited ? theme.black.main : theme.text.secondary)};
    transition: color 0.2s;
  }

  &:hover i {
    color: ${({ theme }) => theme.black.main};
  }

  &:active {
    transform: scale(0.8);
  }
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
`;

const ShippingPrice = styled.p`
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: 500;
  color: ${({ theme }) => theme.text.muted};
  margin: 0;
`;
