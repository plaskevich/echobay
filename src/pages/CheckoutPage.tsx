import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Elements } from '@stripe/react-stripe-js';

import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import type { ShippingAddress } from '@/components/checkout/ShippingForm';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { Button } from '@/components/common/Button';
import { PageTitle } from '@/components/common/PageTitle';
import { stripePromise } from '@/lib/stripe';
import { useListing } from '@/queries/useListings';

type CheckoutStep = 'shipping' | 'payment' | 'summary';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useListing(id!);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
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

  const handleShippingNext = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep('payment');
  };

  const handlePaymentNext = (paymentId: string) => {
    setPaymentIntentId(paymentId);
    setCurrentStep('summary');
  };

  const handlePaymentBack = () => {
    setCurrentStep('shipping');
  };

  const handleSummaryBack = () => {
    setCurrentStep('payment');
  };

  return (
    <Container>
      <Header>
        <PageTitle>Checkout</PageTitle>
      </Header>

      <ProgressBar>
        <ProgressStep active={currentStep === 'shipping'} completed={currentStep !== 'shipping'}>
          <StepNumber active={currentStep === 'shipping'} completed={currentStep !== 'shipping'}>
            {currentStep !== 'shipping' ? '✓' : '1'}
          </StepNumber>
          <StepLabel>Shipping</StepLabel>
        </ProgressStep>
        <ProgressLine completed={currentStep === 'summary' || currentStep === 'payment'} />
        <ProgressStep active={currentStep === 'payment'} completed={currentStep === 'summary'}>
          <StepNumber active={currentStep === 'payment'} completed={currentStep === 'summary'}>
            {currentStep === 'summary' ? '✓' : '2'}
          </StepNumber>
          <StepLabel>Payment</StepLabel>
        </ProgressStep>
        <ProgressLine completed={currentStep === 'summary'} />
        <ProgressStep active={currentStep === 'summary'} completed={false}>
          <StepNumber active={currentStep === 'summary'} completed={false}>
            3
          </StepNumber>
          <StepLabel>Summary</StepLabel>
        </ProgressStep>
      </ProgressBar>

      <Content>
        {currentStep === 'shipping' && (
          <ShippingForm onNext={handleShippingNext} initialData={shippingAddress || undefined} />
        )}

        {currentStep === 'payment' && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={listing.price}
              listingId={listing.id}
              onBack={handlePaymentBack}
              onNext={handlePaymentNext}
            />
          </Elements>
        )}

        {currentStep === 'summary' && shippingAddress && paymentIntentId && (
          <OrderSummary
            listing={listing}
            shippingAddress={shippingAddress}
            paymentIntentId={paymentIntentId}
            onBack={handleSummaryBack}
          />
        )}
      </Content>
    </Container>
  );
}

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
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  color: ${({ theme, active, completed }) => (active || completed ? theme.text.primary : theme.text.tertiary)};
`;

const StepNumber = styled.div<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  background-color: ${({ theme, active, completed }) =>
    active ? 'transparent' : completed ? theme.primary.main : theme.background.secondary};
  color: ${({ theme, active, completed }) => (active || completed ? theme.text.primary : theme.text.muted)};
  transition: all 0.3s;
  border: 2px solid
    ${({ theme, active, completed }) =>
      active ? theme.primary.main : completed ? theme.primary.main : theme.background.secondary};
`;

const StepLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ProgressLine = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${({ theme, completed }) => (completed ? theme.primary.main : theme.border.primary)};
  transition: all 0.3s;
  max-width: 120px;

  @media (max-width: 768px) {
    max-width: 60px;
  }
`;

const Content = styled.div`
  margin-top: 2rem;
`;

const LoadingText = styled.div`
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
