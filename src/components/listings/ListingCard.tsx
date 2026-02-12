import { PiCassetteTapeDuotone, PiDiscDuotone, PiHeart, PiHeartFill, PiVinylRecordDuotone } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import placeholder from '@/assets/cd.png';
import { FORMAT_OPTIONS } from '@/lib/constants/listings';
import { useIsFavorited, useToggleFavorite } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';

export type ListingStatus = 'active' | 'hidden' | 'sold';

export interface Listing {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
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
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : placeholder;
  const { user } = useAuthStore();
  const isOwner = user?.id === listing.owner_id;
  const { data: isFavorited = false } = useIsFavorited(user?.id, listing.id);
  const { toggleFavorite, isLoading } = useToggleFavorite();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) navigate('/auth');
    else await toggleFavorite(user.id, listing.id, isFavorited);
  };

  const getFormatLabel = (value?: string) => {
    if (!value) return null;
    const option = FORMAT_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const getFormatIcon = (value?: string) => {
    switch (value) {
      case 'vinyl':
        return <PiVinylRecordDuotone size={14} />;
      case 'cd':
        return <PiDiscDuotone size={14} />;
      case 'tape':
        return <PiCassetteTapeDuotone size={14} />;
      default:
        return null;
    }
  };

  const showStatusBanner = listing.status !== 'active';
  const showFavoriteButton = !isOwner;

  const getStatusLabel = (status?: ListingStatus) => {
    if (!status) return '';
    switch (status) {
      case 'sold':
        return 'Sold';
      case 'hidden':
        return 'Hidden';
      default:
        return status;
    }
  };

  return (
    <Link to={`/items/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card>
        <ImageContainer>
          <ListingImage src={imageUrl} alt={listing.title} />
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
        <Price>{listing.price.toFixed(2)}€</Price>
        {showFavoriteButton && (
          <FavoriteButton
            onClick={handleFavoriteClick}
            $isFavorited={isFavorited}
            disabled={isLoading}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? <PiHeartFill /> : <PiHeart />}
          </FavoriteButton>
        )}
      </Card>
    </Link>
  );
}

const Card = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 ${(props) => props.theme.shadow.small};
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  &:hover {
    box-shadow: 0 4px 6px -1px ${(props) => props.theme.shadow.medium};
    cursor: pointer;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`;

const ListingImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const ListingTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Artist = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Format = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text.tertiary};
  margin: 0;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Price = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => props.theme.price};
  margin: 0.5rem 0 0 0;
`;

const StatusBanner = styled.div<{ status: ListingStatus }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  border-radius: 0 0 ${(props) => props.theme.borderRadius.md} ${(props) => props.theme.borderRadius.md};
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
  bottom: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 10;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => (props.$isFavorited ? props.theme.favorite : props.theme.text.secondary)};
    filter: drop-shadow(0 2px 4px ${(props) => props.theme.shadow.medium});
    transition: all 0.2s;
  }

  &:hover {
    transform: scale(1.1);
    svg {
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
