import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Order } from '@/api/orders';
import placeholder from '@/assets/cd.png';
import { formatRelativeDate } from '@/lib/formatRelativeDate';

interface OrderCardProps {
  order: Order;
}
export default function OrderCard({ order }: OrderCardProps) {
  const listing = Array.isArray(order.listings) ? order.listings[0] : order.listings;
  const imageUrl = listing?.images && listing.images.length > 0 ? listing.images[0] : placeholder;

  return (
    <Card>
      <CardLink to={`/items/${order.listing_id}`}>
        <ImageContainer>
          <OrderImage src={imageUrl} alt={listing?.title || 'Order item'} />
        </ImageContainer>
        <CardContent>
          <OrderHeader>
            <OrderTitle>{listing?.title || 'Unknown Item'}</OrderTitle>
            <OrderArtist>{listing?.artist || 'Unknown Artist'}</OrderArtist>
          </OrderHeader>
          <OrderDetails>
            <DetailRow>
              <DetailLabel>Amount:</DetailLabel>
              <DetailValue>{order.amount.toFixed(2)}€</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Date:</DetailLabel>
              <DetailValue>{formatRelativeDate(order.created_at)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Status:</DetailLabel>
              <StatusBadge status={order.status}>{order.status}</StatusBadge>
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
  border-radius: ${(props) => props.theme.borderRadius.md};
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
      case 'failed':
        return props.theme.state.error;
      default:
        return props.theme.background.secondary;
    }
  }};
`;
