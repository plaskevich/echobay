import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { Elements } from '@stripe/react-stripe-js';

import { CheckoutProgressBar } from '@/components/checkout/CheckoutProgressBar';
import { OrderConfirmed } from '@/components/checkout/OrderConfirmed';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import type { ShippingAddress } from '@/components/checkout/ShippingForm';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { Button } from '@/components/common/Button';
import { PageTitle } from '@/components/common/PageTitle';
import { Spinner } from '@/components/common/Spinner';
import { stripePromise } from '@/lib/stripe';
import { useListing } from '@/queries/useListings';
import { useShippingAddress } from '@/queries/useShipping';
import { useAuthStore } from '@/store/auth-store';
import { useCheckoutStore } from '@/store/checkout-store';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useListing(id!);
  const user = useAuthStore((s) => s.user);
  const { data: savedAddress } = useShippingAddress(user?.id);

  const progress = useCheckoutStore((s) => (id ? s.byListing[id] : undefined));
  const updateProgress = useCheckoutStore((s) => s.update);
  const clearProgress = useCheckoutStore((s) => s.clear);
  const [confirmed, setConfirmed] = useState(false);

  const [prevListingId, setPrevListingId] = useState(id);
  if (id !== prevListingId) {
    setPrevListingId(id);
    setConfirmed(false);
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingText>
          <Spinner size="1.5rem" $color="currentColor" $trackColor="transparent" />
          Loading checkout…
        </LoadingText>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container>
        <ErrorText>Error: {error instanceof Error ? error.message : 'Listing not found'}</ErrorText>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </Container>
    );
  }

  const shippingAddress = progress?.shippingAddress ?? null;
  const paymentIntentId = progress?.paymentIntentId ?? null;
  let currentStep = progress?.step ?? 'shipping';
  if (currentStep === 'summary' && (!shippingAddress || !paymentIntentId)) {
    currentStep = shippingAddress ? 'payment' : 'shipping';
  } else if (currentStep === 'payment' && !shippingAddress) {
    currentStep = 'shipping';
  }

  const handleShippingNext = (address: ShippingAddress) => {
    updateProgress(id!, { shippingAddress: address, step: 'payment' });
  };

  const handlePaymentNext = (paymentId: string) => {
    updateProgress(id!, { paymentIntentId: paymentId, step: 'summary' });
  };

  const handlePaymentBack = () => {
    updateProgress(id!, { step: 'shipping' });
  };

  const handleSummaryBack = () => {
    updateProgress(id!, { step: 'payment' });
  };

  const handleConfirmed = () => {
    setConfirmed(true);
    clearProgress(id!);
  };

  return (
    <Container>
      {!confirmed && (
        <>
          <Header>
            <PageTitle>Checkout</PageTitle>
          </Header>

          <CheckoutProgressBar currentStep={currentStep} />
        </>
      )}

      <Content>
        {confirmed ? (
          <OrderConfirmed />
        ) : (
          <>
            {currentStep === 'shipping' && (
              <StepPanel key="shipping">
                <ShippingForm
                  onSubmit={handleShippingNext}
                  initialData={shippingAddress || savedAddress || undefined}
                />
              </StepPanel>
            )}

            {currentStep === 'payment' && (
              <StepPanel key="payment">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={listing.price + (listing.shipping_price || 0)}
                    listingId={listing.id}
                    onBack={handlePaymentBack}
                    onNext={handlePaymentNext}
                  />
                </Elements>
              </StepPanel>
            )}

            {currentStep === 'summary' && shippingAddress && paymentIntentId && (
              <OrderSummary
                listing={listing}
                shippingAddress={shippingAddress}
                paymentIntentId={paymentIntentId}
                onBack={handleSummaryBack}
                onConfirmed={handleConfirmed}
              />
            )}
          </>
        )}
      </Content>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
`;

const StepPanel = styled.div`
  padding: 1.5rem 1.75rem;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  box-shadow: ${({ theme }) => theme.elevation.sm};
  animation: ${stepIn} ${({ theme }) => theme.duration.slow} ${({ theme }) => theme.easing.emphasized};

  @media (max-width: 640px) {
    padding: 1.5rem 1.25rem;
  }
`;

const Content = styled.div`
  margin-top: 0;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.state.error};
  margin-bottom: 1rem;
`;
