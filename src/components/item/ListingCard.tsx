import { PiCassetteTapeDuotone, PiDiscDuotone, PiVinylRecordDuotone } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import placeholder from '@/assets/cd.png';
import { FORMAT_OPTIONS } from '@/lib/constants/listings';

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
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : placeholder;

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

  return (
    <Link to={`/items/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card>
        <ListingImage src={imageUrl} alt={listing.title} />
        <Artist>{listing.artist}</Artist>
        <ListingTitle>{listing.title}</ListingTitle>
        {listing.format && (
          <Format>
            {getFormatIcon(listing.format)}
            {getFormatLabel(listing.format)}
          </Format>
        )}
        <Price>{listing.price.toFixed(2)}€</Price>
      </Card>
    </Link>
  );
}

const Card = styled.div`
  background-color: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 1rem;
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

const ListingImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.25rem;
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
  margin: 0.25rem 0 0 0;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.price};
  margin: 1rem 0 0 0;
`;
