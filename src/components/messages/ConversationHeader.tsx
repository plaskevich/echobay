import { PiShoppingCart } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
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
  listingStatus?: string | null;
  isBuyer?: boolean;
  hasOrder?: boolean;
  otherUserId?: string;
  otherUsername?: string;
  otherAvatarUrl?: string | null;
}

export function ConversationHeader({
  listingId,
  title,
  artist,
  format,
  price,
  images,
  listingStatus,
  isBuyer,
  hasOrder,
  otherUserId,
  otherUsername,
}: ConversationHeaderProps) {
  const navigate = useNavigate();
  const imageUrl = images && images.length > 0 ? images[0] : placeholder;
  const formatLabel = format ? FORMAT_OPTIONS.find((opt) => opt.value === format)?.label || format : null;
  const showBuyButton = isBuyer && listingStatus === 'active' && !hasOrder;

  return (
    <Header>
      {otherUserId && (
        <TopRow>
          <UserLink to={`/users/${otherUserId}`}>{otherUsername || 'User'}</UserLink>
        </TopRow>
      )}
      <BottomRow>
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
        {showBuyButton && (
          <BuyButton onClick={() => navigate(`/checkout/${listingId}`)}>
            <PiShoppingCart size={16} />
            Buy now
          </BuyButton>
        )}
      </BottomRow>
    </Header>
  );
}

const Header = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
`;

const TopRow = styled.div`
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
  display: flex;
  justify-content: center;
  @media (max-width: 640px) {
    display: none;
  }
`;

const UserLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.primary.main};
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;

  @media (max-width: 640px) {
    padding: 0.75rem;
  }
`;

const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
  padding: 0.25rem;
  border-radius: ${(props) => props.theme.borderRadius.sm};

  &:hover {
    background-color: ${(props) => props.theme.background.tertiary};
  }
`;

const BuyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid ${(props) => props.theme.primary.main};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: transparent;
  color: ${(props) => props.theme.primary.main};
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => props.theme.primary.light};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 640px) {
    padding: 0.4rem 0.625rem;
    font-size: 0.75rem;
  }
`;

const ItemImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 44px;
    height: 44px;
  }
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
