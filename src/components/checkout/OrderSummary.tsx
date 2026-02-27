import styled from 'styled-components';

import { OrderConfirmed } from '@/components/checkout/OrderConfirmed';
import { Button } from '@/components/common/Button';
import { useOrderConfirmation } from '@/hooks/useOrderConfirmation';
import { formatPrice } from '@/lib/utils';

import type { ShippingAddress } from './ShippingForm';

interface OrderSummaryProps {
  listing: {
    id: string;
    title: string;
    artist: string;
    price: number;
    shipping_price?: number;
    images?: string[];
    owner_id: string;
  };
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
  onBack: () => void;
  onConfirmed?: () => void;
}

export function OrderSummary({ listing, shippingAddress, paymentIntentId, onBack, onConfirmed }: OrderSummaryProps) {
  const { processing, error, confirmed, handleConfirmOrder } = useOrderConfirmation({
    listingId: listing.id,
    listingTitle: listing.title,
    listingOwnerId: listing.owner_id,
    listingPrice: listing.price,
    listingShippingPrice: listing.shipping_price,
    shippingAddress,
    paymentIntentId,
    onConfirmed,
  });

  if (confirmed) {
    return <OrderConfirmed />;
  }

  return (
    <Container data-testid="order-summary">
      <FormTitle data-testid="summary-title">Order Summary</FormTitle>

      <Section>
        <SectionTitle>Item Details</SectionTitle>
        <ItemCard>
          {listing.images && listing.images[0] && <ItemImage src={listing.images[0]} alt={listing.title} />}
          <ItemInfo>
            <ItemArtist data-testid="summary-item-artist">{listing.artist}</ItemArtist>
            <ItemTitle data-testid="summary-item-title">{listing.title}</ItemTitle>
            <ItemPrice data-testid="summary-item-price">{formatPrice(listing.price)}</ItemPrice>
          </ItemInfo>
        </ItemCard>
      </Section>

      <Section>
        <SectionTitle>Shipping Address</SectionTitle>
        <AddressCard data-testid="summary-shipping-address">
          <AddressLine>{shippingAddress.fullName}</AddressLine>
          <AddressLine>{shippingAddress.addressLine1}</AddressLine>
          {shippingAddress.addressLine2 && <AddressLine>{shippingAddress.addressLine2}</AddressLine>}
          <AddressLine>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
          </AddressLine>
          <AddressLine>{shippingAddress.country}</AddressLine>
          <AddressLine>{shippingAddress.phone}</AddressLine>
        </AddressCard>
      </Section>

      <Section>
        <SectionTitle>Payment Method</SectionTitle>
        <PaymentCard data-testid="summary-payment-method">
          <PaymentText>Credit Card</PaymentText>
          <PaymentSubtext>Payment will be processed securely via Stripe</PaymentSubtext>
        </PaymentCard>
      </Section>

      <PriceBreakdown data-testid="summary-price-breakdown">
        <PriceRow>
          <PriceLabel>Item price</PriceLabel>
          <PriceValue data-testid="summary-price-item">{formatPrice(listing.price)}</PriceValue>
        </PriceRow>
        <PriceRow>
          <PriceLabel>Shipping</PriceLabel>
          <PriceValue data-testid="summary-price-shipping">
            {listing.shipping_price && listing.shipping_price > 0 ? formatPrice(listing.shipping_price) : 'Free'}
          </PriceValue>
        </PriceRow>
      </PriceBreakdown>

      <TotalSection>
        <TotalLabel>Total</TotalLabel>
        <TotalAmount data-testid="summary-total">
          {formatPrice(listing.price + (listing.shipping_price || 0))}
        </TotalAmount>
      </TotalSection>

      {error && <ErrorText data-testid="summary-error">{error}</ErrorText>}

      <ButtonContainer>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={processing}
          data-testid="summary-back-button"
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleConfirmOrder}
          isLoading={processing}
          data-testid="summary-confirm-button"
        >
          Confirm & Pay
        </Button>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const ItemCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const ItemArtist = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const ItemPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary.main};
  margin-top: 0.5rem;
`;

const AddressCard = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const AddressLine = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.5;
`;

const PaymentCard = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const PaymentText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
`;

const PaymentSubtext = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const PriceValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 2px solid ${({ theme }) => theme.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: 1rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const TotalLabel = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const TotalAmount = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary.main};

  @media (max-width: 640px) {
    font-size: 1.375rem;
  }
`;

const ErrorText = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.state.error}22;
  border: 1px solid ${({ theme }) => theme.state.error};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.state.error};
  font-size: 0.875rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
`;
