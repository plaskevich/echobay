import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { formatPrice, getFormatLabel } from '@/lib/utils';

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
  const imageUrl = images && images.length > 0 ? images[0] : null;
  const formatLabel = getFormatLabel(format);
  const showBuyButton = isBuyer && listingStatus === 'active' && !hasOrder;

  return (
    <Header data-testid="conversation-header">
      {otherUserId && (
        <TopRow>
          <UserLink to={`/users/${otherUserId}`} data-testid="conversation-header-username">
            {otherUsername || 'User'}
          </UserLink>
        </TopRow>
      )}
      <BottomRow>
        <ItemLink to={`/items/${listingId}`}>
          {imageUrl ? (
            <ItemImage src={imageUrl} alt={title} />
          ) : (
            <ItemFormatFallback aria-label="Listing format icon">{getFormatIcon(format, 24)}</ItemFormatFallback>
          )}
          <ItemDetails>
            <ItemArtist data-testid="conversation-header-artist">{artist}</ItemArtist>
            <ItemTitle data-testid="conversation-header-title">{title}</ItemTitle>
            <ItemMeta data-testid="conversation-header-meta">
              {formatLabel} · <Price>{formatPrice(Number(price))}</Price>
            </ItemMeta>
          </ItemDetails>
        </ItemLink>
        {showBuyButton && (
          <Button
            variant="primary"
            size="small"
            onClick={() => navigate(`/checkout/${listingId}`)}
            data-testid="conversation-buy-button"
          >
            <i className="hn hn-shopping-cart" aria-hidden />
            Buy
          </Button>
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
`;

const ItemImage = styled.img`
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 2.75rem;
    height: 2.75rem;
  }
`;

const ItemFormatFallback = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: #fff;
  color: ${(props) => props.theme.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 2.75rem;
    height: 2.75rem;
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
  color: ${(props) => props.theme.text.primary};
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.text.secondary};
`;
const Price = styled.span`
  font-weight: 600;
  font-family: ${(props) => props.theme.fontFamilyAlt};
`;
