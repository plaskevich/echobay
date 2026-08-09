import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Order } from '@/api/orders';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { formatPrice } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
}
export default function OrderCard({ order }: OrderCardProps) {
  const listing = Array.isArray(order.listings) ? order.listings[0] : order.listings;
  const imageUrl = listing?.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <Card data-testid="order-card">
      <CardLink to={`/messages?listingId=${encodeURIComponent(order.listing_id)}`}>
        <ImageContainer>
          {imageUrl ? (
            <OrderImage src={imageUrl} alt={listing?.title || 'Order item'} />
          ) : (
            <OrderFormatFallback aria-label="Listing format icon">
              {getFormatIcon(listing?.format, 80)}
            </OrderFormatFallback>
          )}
        </ImageContainer>
        <CardContent>
          <OrderHeader>
            <OrderTitle data-testid="order-title">{listing?.title || 'Unknown Item'}</OrderTitle>
            <OrderArtist>{listing?.artist || 'Unknown Artist'}</OrderArtist>
          </OrderHeader>
          <OrderDetails>
            <DetailRow>
              <DetailLabel>Amount:</DetailLabel>
              <DetailValue>
                <span>{formatPrice(order.amount)}</span>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Date:</DetailLabel>
              <DetailValue>
                {new Date(order.created_at).toLocaleDateString('en', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Status:</DetailLabel>
              <StatusBadge data-testid="order-status" status={order.status}>
                {order.status}
              </StatusBadge>
            </DetailRow>
          </OrderDetails>
        </CardContent>
      </CardLink>
    </Card>
  );
}

const Card = styled.div`
  border: 1px solid ${(props) => props.theme.border.primary};
  overflow: hidden;
  transition: all ${(props) => props.theme.transition.base};

  &:hover {
    border-color: ${(props) => props.theme.border.hover};
  }
`;

const CardLink = styled(Link)`
  display: flex;
  gap: 1.5rem;
  text-decoration: none;
  color: inherit;
  padding: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem;
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 8rem;
  height: 8rem;
`;

const OrderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OrderFormatFallback = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.background.elevated};
  color: ${(props) => props.theme.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const OrderHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const OrderArtist = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.primary};
  font-weight: 700;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  & > span {
    font-family: ${(props) => props.theme.fontFamilyAlt};
    font-weight: 600;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  color: ${(props) => {
    switch (props.status) {
      case 'paid':
      case 'confirmed':
        return props.theme.primary.main;
      case 'shipped':
        return props.theme.primary.main;
      case 'delivered':
        return props.theme.state.success;
      case 'failed':
        return props.theme.state.error;
      default:
        return props.theme.text.secondary;
    }
  }};
`;
