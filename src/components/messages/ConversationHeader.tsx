import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { breakpoint } from '@/lib/theme/breakpoints';
import { ellipsis } from '@/lib/theme/mixins';
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
    <div data-testid="conversation-header">
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
    </div>
  );
}

const TopRow = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  justify-content: center;
  @media (max-width: ${breakpoint.md}) {
    display: none;
  }
`;

const UserLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${(props) => props.theme.text.primary};
  transition: color ${(props) => props.theme.transition.fast};

  &:hover {
    color: ${(props) => props.theme.primary.main};
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 1.25rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  &:hover {
    border-color: ${(props) => props.theme.border.hover};
  }

  @media (max-width: ${breakpoint.md}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: inherit;
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing['2xs']};
`;

const ItemImage = styled.img`
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: ${breakpoint.md}) {
    width: 2.75rem;
    height: 2.75rem;
  }
`;

const ItemFormatFallback = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: ${(props) => props.theme.background.elevated};
  color: ${(props) => props.theme.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${breakpoint.md}) {
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
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
  ${ellipsis}
  color: ${(props) => props.theme.text.primary};
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.text.secondary};
`;
const Price = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-family: ${(props) => props.theme.fontFamilyAlt};
`;
