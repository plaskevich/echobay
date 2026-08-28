import styled from 'styled-components';

import type { MessageMetadata, SystemEvent } from '@/api/messages';
import type { OrderStatus } from '@/api/orders';

import { SellerRatingWidget } from './SellerRatingWidget';
import { ActionButton, SellerShippingDetails, StatusTag } from './SellerShippingDetails';

export interface SystemMessageProps {
  metadata: MessageMetadata;
  isSeller: boolean;
  isBuyer: boolean;
  orderStatus?: OrderStatus;
  sellerId?: string;
  onConfirmShipped?: (orderId: string) => void;
  onConfirmReceived?: (orderId: string) => void;
  isUpdating?: boolean;
}

export function SystemMessage({
  metadata,
  isSeller,
  isBuyer,
  orderStatus,
  sellerId,
  onConfirmShipped,
  onConfirmReceived,
  isUpdating,
}: SystemMessageProps) {
  return (
    <Card data-testid="system-message">
      <SystemIcon event={metadata.event} />
      <SystemContent
        metadata={metadata}
        isSeller={isSeller}
        isBuyer={isBuyer}
        orderStatus={orderStatus}
        sellerId={sellerId}
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
          <i className="hn hn-archive" aria-hidden />
        </IconWrapper>
      );
    case 'shipping_info':
    case 'shipped':
      return (
        <IconWrapper $color="primary">
          <i className="hn hn-box-heart" aria-hidden />
        </IconWrapper>
      );
    case 'delivered':
      return (
        <IconWrapper $color="success">
          <i className="hn hn-badge-check" aria-hidden />
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
  sellerId,
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
              <Title data-testid="system-message-title">Item Sold!</Title>
              <Text data-testid="system-message-text">
                "{listing_title}" has been purchased. Please prepare it for shipping.
              </Text>
            </>
          ) : (
            <>
              <Title data-testid="system-message-title">Order Placed</Title>
              <Text data-testid="system-message-text">
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
            <Title data-testid="system-message-title">Shipping Details</Title>
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
          <Title data-testid="system-message-title">Shipping Details</Title>
          <Text data-testid="system-message-text">Shipping details have been sent to the seller.</Text>
        </TextBlock>
      );

    case 'shipped':
      return (
        <TextBlock>
          {isBuyer ? (
            <>
              <Title data-testid="system-message-title">Item Shipped!</Title>
              <Text data-testid="system-message-text">
                The seller has shipped your item. Let them know when you receive it.
              </Text>
              {orderStatus === 'shipped' && onConfirmReceived && (
                <ActionButton
                  variant="primary"
                  size="small"
                  onClick={() => onConfirmReceived(order_id)}
                  isLoading={isUpdating}
                  data-testid="confirm-received-button"
                >
                  {!isUpdating && <i className="hn hn-box-heart" aria-hidden />}
                  Confirm Received
                </ActionButton>
              )}
              {orderStatus === 'delivered' && <StatusTag $variant="delivered">Received</StatusTag>}
            </>
          ) : (
            <>
              <Title data-testid="system-message-title">Item Shipped</Title>
              <Text data-testid="system-message-text">
                You confirmed that the item has been shipped. Waiting for buyer to confirm receipt.
              </Text>
            </>
          )}
        </TextBlock>
      );

    case 'delivered':
      return (
        <TextBlock>
          <Title data-testid="system-message-title">Item Received</Title>
          <Text data-testid="system-message-text">
            {isSeller
              ? 'The buyer has confirmed receiving the item. Transaction complete!'
              : 'You confirmed receiving the item. Transaction complete!'}
          </Text>
          {isBuyer && sellerId && <SellerRatingWidget orderId={order_id} sellerId={sellerId} />}
        </TextBlock>
      );

    default:
      return <Text>{metadata.event}</Text>;
  }
}

const Card = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  align-items: center;
  background-color: ${({ theme }) => theme.background.elevated};
`;

const IconWrapper = styled.div<{ $color: 'success' | 'primary' }>`
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  color: ${({ theme, $color }) => ($color === 'success' ? theme.state.success : theme.primary.main)};
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
`;

const Text = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`;
