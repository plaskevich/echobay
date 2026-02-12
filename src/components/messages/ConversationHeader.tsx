import { Link } from 'react-router-dom';
import styled from 'styled-components';

import placeholder from '@/assets/cd.png';
import { FORMAT_OPTIONS } from '@/lib/constants/listings';

interface ConversationHeaderProps {
  listingId: string;
  title: string;
  artist: string;
  format?: string | null;
  price: number;
  images?: string[] | null;
}

export function ConversationHeader({ listingId, title, artist, format, price, images }: ConversationHeaderProps) {
  const imageUrl = images && images.length > 0 ? images[0] : placeholder;
  const formatLabel = format ? FORMAT_OPTIONS.find((opt) => opt.value === format)?.label || format : null;

  return (
    <Header>
      <ItemLink to={`/items/${listingId}`}>
        <ItemImage src={imageUrl} alt={title} />
        <ItemDetails>
          <ItemArtist>{artist}</ItemArtist>
          <ItemTitle>{title}</ItemTitle>
          <ItemMeta>
            {formatLabel} · {Number(price).toFixed(2)}€
          </ItemMeta>
        </ItemDetails>
      </ItemLink>
    </Header>
  );
}

const Header = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${(props) => props.theme.border.primary};

  &:hover {
    background-color: ${(props) => props.theme.background.tertiary};
  }
`;

const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
`;

const ItemImage = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemArtist = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.text.secondary};
`;

const ItemTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.theme.text.secondary};
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.text.muted};
`;
