import styled from 'styled-components';

import placeholder from '@/assets/cd.png';

export interface Listing {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  images?: string[];
  created_at: string;
  owner_id: string;
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : placeholder;

  return (
    <Card>
      <ListingImage src={imageUrl} alt={listing.title} />
      <Artist>{listing.artist}</Artist>
      <ListingTitle>{listing.title}</ListingTitle>
      <Price>{listing.price.toFixed(2)}€</Price>
    </Card>
  );
}

const Card = styled.div`
  background-color: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 0.75rem;
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
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const Artist = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.state.success};
  margin: 1rem 0 0 0;
`;
