import styled from 'styled-components';

import type { ShippingAddress } from '@/api/shipping';
import { OrderConfirmed } from '@/components/checkout/OrderConfirmed';
import { Amount, StepCard, StepPanel, StepTitle } from '@/components/checkout/styles';
import { Button } from '@/components/common/Button';
import { ButtonGroup } from '@/components/common/Form';
import { useOrderConfirmation } from '@/hooks/useOrderConfirmation';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { breakpoint } from '@/lib/theme/breakpoints';
import { capitalize, formatPrice, getFormatLabel } from '@/lib/utils';

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
    shippingAddress,
    paymentIntentId,
    onConfirmed,
  });

  if (confirmed) {
    return <OrderConfirmed />;
  }

  return (
    <Container data-testid="order-summary">
      <StepTitle data-testid="summary-title">Order Summary</StepTitle>

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
          <PaymentIcon className="hn hn-credit-card" aria-hidden />
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

      <ButtonGroup>
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
      </ButtonGroup>
    </Container>
  );
}

const Container = styled(StepPanel)`
  gap: 1.25rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const ItemCard = styled(StepCard)`
  align-items: stretch;
`;

const ItemImage = styled.img`
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  object-fit: cover;
`;

const Format = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${(props) => props.theme.text.secondary};
  margin: auto 0 0;
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
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
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const ItemArtist = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
`;

const ItemTitle = styled.div`
  font-size: 1.0625rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
`;

const AddressCard = styled(StepCard)`
  flex-direction: column;
  gap: 0;
`;

const AddressLine = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.5;
`;

const PaymentCard = styled(StepCard)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PaymentIcon = styled.i`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  line-height: 1;
  color: ${({ theme }) => theme.text.primary};
`;

const PaymentText = styled.div`
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing['3xs']};
`;

const PaymentSubtext = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.secondary};
`;

const PriceBreakdown = styled(StepCard)`
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.25rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
`;

const PriceValue = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
`;

const TotalLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
`;

const TotalAmount = styled(Amount)`
  font-size: ${({ theme }) => theme.fontSize['2xl']};

  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

const ErrorText = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.state.error};
  color: ${({ theme }) => theme.state.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
