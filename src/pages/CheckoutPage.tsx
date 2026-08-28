import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Elements } from '@stripe/react-stripe-js';

import type { ShippingAddress } from '@/api/shipping';
import { CheckoutProgressBar } from '@/components/checkout/CheckoutProgressBar';
import { OrderConfirmed } from '@/components/checkout/OrderConfirmed';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { StepPanel } from '@/components/checkout/styles';
import { ErrorPage } from '@/components/common/ErrorPage';
import { PageTitle } from '@/components/common/PageTitle';
import { LoadingState } from '@/components/common/StateDisplay';
import { stripePromise } from '@/lib/stripe';
import { breakpoint } from '@/lib/theme/breakpoints';
import { useListing } from '@/queries/useListings';
import { useShippingAddress } from '@/queries/useShipping';
import { useAuthStore } from '@/store/auth-store';
import { useCheckoutStore } from '@/store/checkout-store';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
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
        <LoadingState message="Loading checkout" />
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container>
        {error ? (
          <ErrorPage message={error instanceof Error ? error.message : undefined} />
        ) : (
          <ErrorPage notFound title="Listing not found" message="This listing doesn't exist or has been removed." />
        )}
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

      {confirmed ? (
        <OrderConfirmed />
      ) : (
        <>
          {currentStep === 'shipping' && (
            <StepPanel key="shipping">
              <ShippingForm onSubmit={handleShippingNext} initialData={shippingAddress || savedAddress || undefined} />
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
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${breakpoint.md}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
