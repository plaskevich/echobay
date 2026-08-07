import { PiCreditCardFill } from 'react-icons/pi';
import styled, { keyframes } from 'styled-components';

import { OrderConfirmed } from '@/components/checkout/OrderConfirmed';
import { Button } from '@/components/common/Button';
import { useOrderConfirmation } from '@/hooks/useOrderConfirmation';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { capitalize, formatPrice, getFormatLabel } from '@/lib/utils';

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
    label?: string | null;
    year?: number | null;
    format?: string;
    condition: string;
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

      <ItemCard>
        {listing.images && listing.images[0] && <ItemImage src={listing.images[0]} alt={listing.title} />}
        <ItemInfo>
          <ItemArtist data-testid="summary-item-artist">{listing.artist}</ItemArtist>
          <ItemTitle data-testid="summary-item-title">{listing.title}</ItemTitle>
          <ItemCondition>{capitalize(listing.condition)}</ItemCondition>
          {listing.format && (
            <Format>
              {getFormatIcon(listing.format)}
              {getFormatLabel(listing.format)}
            </Format>
          )}
        </ItemInfo>
      </ItemCard>

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
          <PaymentIcon>
            <PiCreditCardFill aria-hidden />
          </PaymentIcon>
          <div>
            <PaymentText>Credit Card</PaymentText>
            <PaymentSubtext>Processed securely via Stripe</PaymentSubtext>
          </div>
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
        <TotalRow>
          <TotalLabel>Total</TotalLabel>
          <TotalAmount data-testid="summary-total">
            {formatPrice(listing.price + (listing.shipping_price || 0))}
          </TotalAmount>
        </TotalRow>
      </PriceBreakdown>

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

const stepIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  box-shadow: ${({ theme }) => theme.elevation.sm};
  animation: ${stepIn} ${({ theme }) => theme.duration.slow} ${({ theme }) => theme.easing.emphasized};

  @media (max-width: 640px) {
    padding: 1.5rem 1.25rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const ItemCard = styled.div`
  display: flex;
  align-items: stretch;
  gap: 1rem;
  flex: 1;
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  object-fit: cover;
`;

const Format = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text.tertiary};
  margin: auto 0 0;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const ItemCondition = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.muted};
  font-weight: 500;
`;

const ItemArtist = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ItemTitle = styled.div`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const AddressCard = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const AddressLine = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.5;
`;

const PaymentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const PaymentIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.primary.light};
  color: ${({ theme }) => theme.primary.main};
  font-size: 1.25rem;
`;

const PaymentText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.125rem;
`;

const PaymentSubtext = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  padding: 1.25rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primary.light},
    ${({ theme }) => theme.background.primary}
  );
  border: 1px solid ${({ theme }) => theme.primary.main};
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

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 0.75rem;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const TotalAmount = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};

  @media (max-width: 640px) {
    font-size: 1.375rem;
  }
`;

const ErrorText = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.state.error}22;
  border: 1px solid ${({ theme }) => theme.state.error};
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
