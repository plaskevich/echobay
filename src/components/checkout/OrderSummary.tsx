import { useState } from 'react';
import { PiSpinner } from 'react-icons/pi';
import styled from 'styled-components';

import { confirmPayment } from '@/api/checkout';
import OrderConfirmed from '@/components/checkout/OrderConfirmed';
import { Button } from '@/components/common/Button';

import type { ShippingAddress } from './ShippingForm';

interface OrderSummaryProps {
  listing: {
    id: string;
    title: string;
    artist: string;
    price: number;
    images?: string[];
  };
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
  onBack: () => void;
}

export function OrderSummary({ listing, shippingAddress, paymentIntentId, onBack }: OrderSummaryProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirmOrder = async () => {
    setProcessing(true);
    setError(null);

    try {
      const result = await confirmPayment({
        listingId: listing.id,
        shippingAddress,
        paymentIntentId,
        amount: listing.price,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm order');
      }
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  if (confirmed) {
    return <OrderConfirmed />;
  }

  return (
    <Container>
      <FormTitle>Order Summary</FormTitle>

      <Section>
        <SectionTitle>Item Details</SectionTitle>
        <ItemCard>
          {listing.images && listing.images[0] && <ItemImage src={listing.images[0]} alt={listing.title} />}
          <ItemInfo>
            <ItemArtist>{listing.artist}</ItemArtist>
            <ItemTitle>{listing.title}</ItemTitle>
            <ItemPrice>{listing.price.toFixed(2)}€</ItemPrice>
          </ItemInfo>
        </ItemCard>
      </Section>

      <Section>
        <SectionTitle>Shipping Address</SectionTitle>
        <AddressCard>
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
        <PaymentCard>
          <PaymentText>Credit Card</PaymentText>
          <PaymentSubtext>Payment will be processed securely via Stripe</PaymentSubtext>
        </PaymentCard>
      </Section>

      <TotalSection>
        <TotalLabel>Total</TotalLabel>
        <TotalAmount>{listing.price.toFixed(2)}€</TotalAmount>
      </TotalSection>

      {error && <ErrorText>{error}</ErrorText>}

      <ButtonContainer>
        <Button type="button" variant="outline" size="large" onClick={onBack} disabled={processing}>
          Back
        </Button>
        <Button type="button" variant="primary" size="large" onClick={handleConfirmOrder} disabled={processing}>
          {processing ? (
            <>
              <PiSpinner className="spin" size={20} />
              Processing...
            </>
          ) : (
            'Confirm & Pay'
          )}
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
