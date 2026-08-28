import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import type { Listing, ListingStatus } from '@/api/listings';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { breakpoint } from '@/lib/theme/breakpoints';
import { ellipsis } from '@/lib/theme/mixins';
import { formatPrice, getFormatLabel, getStatusLabel } from '@/lib/utils';
import { useIsFavorited, useToggleFavorite } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : null;
  const { user } = useAuthStore();
  const isOwner = user?.id === listing.owner_id;
  const isFavorited = useIsFavorited(user?.id, listing.id);
  const { toggleFavorite, isLoading } = useToggleFavorite();
  const openAuthDialog = useAuthStore((state) => state.openAuthDialog);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) openAuthDialog();
    else await toggleFavorite(user.id, listing.id, isFavorited);
  };

  const showStatusBanner = listing.status !== 'active';
  const showFavoriteButton = !isOwner;

  return (
    <CardLink to={`/items/${listing.id}`}>
      <Card data-testid="listing-card">
        <ImageContainer $dimmed={showStatusBanner}>
          {imageUrl ? (
            <ListingImage src={imageUrl} alt={listing.title} />
          ) : (
            <FormatIconFallback aria-label={`${getFormatLabel(listing.format)} icon`}>
              {getFormatIcon(listing.format, 100)}
            </FormatIconFallback>
          )}
          {showStatusBanner && (
            <StatusBanner $status={listing.status!}>
              <i className={listing.status === 'sold' ? 'hn hn-tag-solid' : 'hn hn-eye-cross-solid'} />
              {getStatusLabel(listing.status)}
            </StatusBanner>
          )}
        </ImageContainer>
        <Artist>{listing.artist}</Artist>
        <ListingTitle>{listing.title}</ListingTitle>
        {listing.format && (
          <Format>
            {getFormatIcon(listing.format)}
            {getFormatLabel(listing.format)}
          </Format>
        )}
        <Price>{formatPrice(listing.price)}</Price>
        {showFavoriteButton && (
          <FavoriteButton
            onClick={handleFavoriteClick}
            $isFavorited={isFavorited}
            disabled={isLoading}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={isFavorited ? 'hn hn-heart-solid' : 'hn hn-heart'} />
          </FavoriteButton>
        )}
      </Card>
    </CardLink>
  );
}

const CardLink = styled(Link)`
  color: inherit;
  display: flex;
  min-width: 0;
`;

const Card = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.background.primary};
  padding: ${(props) => props.theme.spacing.xs};
  transition:
    box-shadow ${(props) => props.theme.transition.base},
    transform ${(props) => props.theme.transition.base},
    border-color ${(props) => props.theme.transition.base};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  gap: 0.1rem;
  &:hover {
    cursor: pointer;
  }

  @media (max-width: ${breakpoint.xs}) {
    padding: ${(props) => props.theme.spacing.sm};
  }
`;

const ImageContainer = styled.div<{ $dimmed?: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;

  ${(props) =>
    props.$dimmed &&
    css`
      > :first-child {
        filter: brightness(0.8) blur(1px);
        transform: scale(1.04);
      }
    `}

  @media (max-width: ${breakpoint.xs}) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const ListingImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const FormatIconFallback = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListingTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin: 0;
  color: ${(props) => props.theme.text.primary};
  ${ellipsis}

  @media (max-width: ${breakpoint.xs}) {
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
`;

const Artist = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  ${ellipsis}

  @media (max-width: ${breakpoint.xs}) {
    font-size: 0.8125rem;
  }
`;

const Format = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Price = styled.p`
  font-family: ${(props) => props.theme.fontFamilyAlt};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  color: ${(props) => props.theme.text.primary};
  margin: auto 0 0 0;
  padding-top: 0.2rem;
`;

const StatusBanner = styled.div<{ $status: ListingStatus }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.xs} 0.6rem;
  background-color: ${(props) =>
    props.$status === 'sold' ? props.theme.primary.main : props.theme.background.tertiary};
  color: ${(props) => (props.$status === 'sold' ? props.theme.text.inverse : props.theme.text.primary)};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FavoriteButton = styled.button<{ $isFavorited: boolean }>`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${(props) => props.theme.transition.base};
  z-index: 10;

  i {
    font-size: 1.4rem;
    color: ${(props) => (props.$isFavorited ? props.theme.black.main : props.theme.text.secondary)};
    transition: all ${(props) => props.theme.transition.base};
  }

  &:hover {
    i {
      color: ${(props) => props.theme.black.main};
    }
  }

  &:active {
    transform: scale(0.9);
  }
`;
