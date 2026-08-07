import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getFormatIcon } from '@/lib/getFormatIcon';
import { formatPrice, getFormatLabel, getStatusLabel } from '@/lib/utils';
import { useIsFavorited, useToggleFavorite } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';

export type ListingStatus = 'active' | 'hidden' | 'sold';

export interface Listing {
  id: string;
  title: string;
  artist: string;
  year?: number | null;
  description: string;
  price: number;
  shipping_price?: number;
  format?: string;
  images?: string[];
  created_at: string;
  owner_id: string;
  status?: ListingStatus;
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : null;
  const { user } = useAuthStore();
  const isOwner = user?.id === listing.owner_id;
  const { data: isFavorited = false } = useIsFavorited(user?.id, listing.id);
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
        <ImageContainer>
          {imageUrl ? (
            <ListingImage src={imageUrl} alt={listing.title} />
          ) : (
            <FormatIconFallback aria-label={`${getFormatLabel(listing.format)} icon`}>
              {getFormatIcon(listing.format, 100)}
            </FormatIconFallback>
          )}
          {showStatusBanner && <StatusBanner status={listing.status!}>{getStatusLabel(listing.status)}</StatusBanner>}
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
  text-decoration: none;
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

  @media (max-width: 480px) {
    padding: ${(props) => props.theme.spacing.sm};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
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
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const Artist = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const Format = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Price = styled.p`
  font-family: ${(props) => props.theme.fontFamilyAlt};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  color: ${(props) => props.theme.text.primary};
  margin: auto 0 0 0;
  padding-top: 0.2rem;
`;

const StatusBanner = styled.div<{ status: ListingStatus }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.status === 'sold' ? props.theme.status.sold.background : props.theme.status.hidden.background};
  color: ${(props) => (props.status === 'sold' ? props.theme.status.sold.text : props.theme.status.hidden.text)};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 6px 16px ${(props) => props.theme.shadow.medium};
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
  transition: transform 0.2s;
  z-index: 10;

  i {
    font-size: 1.4rem;
    color: ${(props) => (props.$isFavorited ? props.theme.favorite : props.theme.text.secondary)};
    filter: drop-shadow(0 2px 4px ${(props) => props.theme.shadow.medium});
    transition: all 0.2s;
  }

  &:hover {
    i {
      color: ${(props) => props.theme.favorite};
    }
  }

  &:active {
    transform: scale(0.9);
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }
`;
