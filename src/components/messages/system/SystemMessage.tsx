import { PiCheckCircle, PiPackage, PiTruck } from 'react-icons/pi';
import styled from 'styled-components';

import type { MessageMetadata, SystemEvent } from '@/api/messages';

import { SellerShippingDetails } from './SellerShippingDetails';

export interface SystemMessageProps {
  metadata: MessageMetadata;
  isSeller: boolean;
  isBuyer: boolean;
  orderStatus?: string;
  onConfirmShipped?: (orderId: string) => void;
  onConfirmReceived?: (orderId: string) => void;
  isUpdating?: boolean;
}

export function SystemMessage({
  metadata,
  isSeller,
  isBuyer,
  orderStatus,
  onConfirmShipped,
  onConfirmReceived,
  isUpdating,
}: SystemMessageProps) {
  return (
    <Card>
      <SystemIcon event={metadata.event} />
      <SystemContent
        metadata={metadata}
        isSeller={isSeller}
        isBuyer={isBuyer}
        orderStatus={orderStatus}
        onConfirmShipped={onConfirmShipped}
        onConfirmReceived={onConfirmReceived}
        isUpdating={isUpdating}
      />
    </Card>
  );
}

function SystemIcon({ event }: { event: SystemEvent }) {
  switch (event) {
    case 'order_placed':
      return (
        <IconWrapper $color="success">
          <PiPackage size={22} />
        </IconWrapper>
      );
    case 'shipping_info':
    case 'shipped':
      return (
        <IconWrapper $color="primary">
          <PiTruck size={22} />
        </IconWrapper>
      );
    case 'delivered':
      return (
        <IconWrapper $color="success">
          <PiCheckCircle size={22} />
        </IconWrapper>
      );
    default:
      return null;
  }
}

function SystemContent({
  metadata,
  isSeller,
  isBuyer,
  orderStatus,
  onConfirmShipped,
  onConfirmReceived,
  isUpdating,
}: SystemMessageProps) {
  const { event, order_id, listing_title, shipping_address } = metadata;

  switch (event) {
    case 'order_placed':
      return (
        <TextBlock>
          {isSeller ? (
            <>
              <Title>Item Sold!</Title>
              <Text>"{listing_title}" has been purchased. Please prepare it for shipping.</Text>
            </>
          ) : (
            <>
              <Title>Order Placed</Title>
              <Text>
                Your order for "{listing_title}" has been confirmed. The seller is preparing your item for shipping.
              </Text>
            </>
          )}
        </TextBlock>
      );

    case 'shipping_info':
      if (isSeller && shipping_address) {
        return (
          <TextBlock>
            <Title>Shipping Details</Title>
            <SellerShippingDetails
              shippingAddress={shipping_address}
              orderId={order_id}
              orderStatus={orderStatus}
              onConfirmShipped={onConfirmShipped}
              isUpdating={isUpdating}
            />
          </TextBlock>
        );
      }
      return (
        <TextBlock>
          <Title>Shipping Details</Title>
          <Text>Shipping details have been sent to the seller.</Text>
        </TextBlock>
      );

    case 'shipped':
      return (
        <TextBlock>
          {isBuyer ? (
            <>
              <Title>Item Shipped!</Title>
              <Text>The seller has shipped your item. Let them know when you receive it.</Text>
              {orderStatus === 'shipped' && onConfirmReceived && (
                <ActionButton onClick={() => onConfirmReceived(order_id)} disabled={isUpdating}>
                  <PiCheckCircle size={18} />
                  {isUpdating ? 'Updating...' : 'Confirm Received'}
                </ActionButton>
              )}
              {orderStatus === 'delivered' && <StatusTag $variant="delivered">Received</StatusTag>}
            </>
          ) : (
            <>
              <Title>Item Shipped</Title>
              <Text>You confirmed that the item has been shipped. Waiting for buyer to confirm receipt.</Text>
            </>
          )}
        </TextBlock>
      );

    case 'delivered':
      return (
        <TextBlock>
          <Title>Item Received</Title>
          <Text>
            {isSeller
              ? 'The buyer has confirmed receiving the item. Transaction complete!'
              : 'You confirmed receiving the item. Transaction complete!'}
          </Text>
        </TextBlock>
      );

    default:
      return <Text>{metadata.event}</Text>;
  }
}

const Card = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const IconWrapper = styled.div<{ $color: 'success' | 'primary' }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $color }) =>
    $color === 'success' ? `${theme.state.success}20` : `${theme.primary.main}20`};
  color: ${({ theme, $color }) => ($color === 'success' ? theme.state.success : theme.primary.main)};
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const Text = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  display: inline-flex;
  margin-top: 0.5rem;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.primary.main};
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: opacity 0.2s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const StatusTag = styled.span<{ $variant: 'shipped' | 'delivered' }>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ theme, $variant }) =>
    $variant === 'delivered' ? `${theme.state.success}20` : `${theme.primary.main}20`};
  color: ${({ theme, $variant }) => ($variant === 'delivered' ? theme.state.success : theme.primary.main)};
`;
