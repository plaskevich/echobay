import { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { createPaymentIntent } from '@/api/checkout';
import { Amount, StepCard, StepTitle } from '@/components/checkout/styles';
import { Button } from '@/components/common/Button';
import { ButtonGroup, Form } from '@/components/common/Form';
import { formatPrice } from '@/lib/utils';

interface PaymentFormProps {
  amount: number;
  listingId: string;
  onBack: () => void;
  onNext: (paymentIntentId: string, clientSecret: string) => void;
}

export function PaymentForm({ amount, listingId, onBack, onNext }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { clientSecret, paymentIntentId } = await createPaymentIntent(listingId);

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      onNext(paymentIntentId, clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setProcessing(false);
    }
  };

  const cardElementOptions = useMemo(
    () => ({
      style: {
        base: {
          fontSize: '16px',
          color: theme.text.primary,
          fontFamily: theme.fontFamily,
          iconColor: theme.text.secondary,
          '::placeholder': {
            color: theme.text.tertiary,
          },
        },
        invalid: {
          color: theme.state.error,
          iconColor: theme.state.error,
        },
      },
    }),
    [theme]
  );

  return (
    <Form onSubmit={handleSubmit} data-testid="payment-form">
      <StepTitle data-testid="payment-form-title">Payment Details</StepTitle>

      <OrderAmount>
        <AmountLabel>Total Amount</AmountLabel>
        <AmountValue data-testid="payment-total-amount">{formatPrice(amount)}</AmountValue>
      </OrderAmount>

      <PaymentSection>
        <Label>Card Information</Label>
        <CardElementWrapper>
          <CardElement options={cardElementOptions} />
        </CardElementWrapper>
        {error && <ErrorText data-testid="payment-error">{error}</ErrorText>}
        <SecureNote>
          <i className="hn hn-lock" aria-hidden />
          Payments are encrypted and processed securely by Stripe.
        </SecureNote>
      </PaymentSection>

      <TestModeNotice>
        <NoticeTitle>
          <i className="hn hn-info-circle" aria-hidden /> Test Mode
        </NoticeTitle>
        <NoticeText>
          Use test card: <span>4242 4242 4242 4242</span>
          <br />
          Any future expiry date, any 3-digit CVC
        </NoticeText>
      </TestModeNotice>

      <ButtonGroup>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={processing}
          data-testid="payment-back-button"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!stripe || processing}
          isLoading={processing}
          data-testid="payment-submit-button"
        >
          Review Order
        </Button>
      </ButtonGroup>
    </Form>
  );
}

const OrderAmount = styled(StepCard)`
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
`;

const AmountLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

const AmountValue = styled(Amount)`
  font-size: 1.5rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const CardElementWrapper = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.background.primary};
  transition: border-color ${({ theme }) => theme.transition.base};

  &:focus-within {
    border-color: ${({ theme }) => theme.border.hover};
    background-color: ${({ theme }) => theme.background.elevated};
  }
`;

const ErrorText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.state.error};
  margin-top: 0.5rem;
`;

const SecureNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};

  i {
    color: ${({ theme }) => theme.state.success};
    flex-shrink: 0;
  }
`;

const TestModeNotice = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.background.elevated};
`;

const NoticeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;
`;

const NoticeText = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;

  span {
    padding: 0.125rem 0.375rem;
    font-family: ${({ theme }) => theme.fontFamilyAlt};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
  }
`;
