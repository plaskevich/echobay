import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Order } from '@/api/orders';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { signatureSurface } from '@/lib/theme';
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
              <DetailValue>{formatPrice(order.amount)}</DetailValue>
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
  background-color: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  ${signatureSurface}
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 3px 0 ${(props) => props.theme.shadow.small};

  &:hover {
    box-shadow: 0 4px 6px -1px ${(props) => props.theme.shadow.medium};
  }
`;

const CardLink = styled(Link)`
  display: flex;
  gap: 1.5rem;
  text-decoration: none;
  color: inherit;
  padding: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 120px;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: auto;
  }
`;

const OrderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.md};

  @media (max-width: 480px) {
    aspect-ratio: 16 / 9;
  }
`;

const OrderFormatFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    aspect-ratio: 16 / 9;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderTitle = styled.h3`
  font-size: 1.125rem;
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
  gap: 0.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.tertiary};
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  color: ${(props) => {
    switch (props.status) {
      case 'paid':
      case 'confirmed':
        return props.theme.state.success;
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
