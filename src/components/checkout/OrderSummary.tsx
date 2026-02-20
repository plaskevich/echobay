import { useState } from 'react';
import styled from 'styled-components';

import { confirmPayment } from '@/api/checkout';
import { createChat, getChatByListing, sendOrderSystemMessages } from '@/api/messages';
import { OrderConfirmed } from '@/components/checkout/OrderConfirmed';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/auth-store';

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
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleConfirmOrder = async () => {
    setProcessing(true);
    setError(null);

    try {
      const totalAmount = listing.price + (listing.shipping_price || 0);
      const result = await confirmPayment({
        listingId: listing.id,
        shippingAddress,
        paymentIntentId,
        amount: totalAmount,
      });

      if (!result.success || !result.orderId) {
        throw new Error(result.error || 'Failed to confirm order');
      }

      if (user) {
        try {
          const existingChat = await getChatByListing(user.id, listing.owner_id, listing.id);
          let newChatId: string;

          if (existingChat.data) {
            newChatId = existingChat.data.id;
          } else {
            const chatResult = await createChat(user.id, listing.owner_id, listing.id, result.orderId);
            if (chatResult.error || !chatResult.data) {
              throw new Error('Failed to create chat');
            }
            newChatId = chatResult.data.id;
          }

          await sendOrderSystemMessages(newChatId, user.id, result.orderId, listing.title, shippingAddress);
        } catch {
          // Chat creation failed but order succeeded - still show confirmation
        }
      }

      setConfirmed(true);
      onConfirmed?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment. Please try again.');
    } finally {
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

      <PriceBreakdown>
        <PriceRow>
          <PriceLabel>Item price</PriceLabel>
          <PriceValue>{listing.price.toFixed(2)}€</PriceValue>
        </PriceRow>
        <PriceRow>
          <PriceLabel>Shipping</PriceLabel>
          <PriceValue>
            {listing.shipping_price && listing.shipping_price > 0 ? `${listing.shipping_price.toFixed(2)}€` : 'Free'}
          </PriceValue>
        </PriceRow>
      </PriceBreakdown>

      <TotalSection>
        <TotalLabel>Total</TotalLabel>
        <TotalAmount>{(listing.price + (listing.shipping_price || 0)).toFixed(2)}€</TotalAmount>
      </TotalSection>

      {error && <ErrorText>{error}</ErrorText>}

      <ButtonContainer>
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirmOrder} isLoading={processing}>
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
