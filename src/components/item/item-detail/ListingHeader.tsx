import styled from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';
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
  const isFavorited = useIsFavorited(user?.id, listingId);
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
  gap: ${({ theme }) => theme.spacing.md};
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
  transition: transform ${({ theme }) => theme.transition.base};

  i {
    font-size: 1.75rem;
    color: ${({ theme, $isFavorited }) => ($isFavorited ? theme.black.main : theme.text.secondary)};
    transition: color ${({ theme }) => theme.transition.base};
  }

  &:hover i {
    color: ${({ theme }) => theme.black.main};
  }

  &:active {
    transform: scale(0.8);
  }
`;

const Artist = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;

  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xs']};
  margin-top: -0.5rem;
`;

const Price = styled.p`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};
  margin: 0;
`;

const ShippingPrice = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.muted};
  margin: 0;
`;
