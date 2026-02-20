import { useState } from 'react';
import styled from 'styled-components';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { createPaymentIntent } from '@/api/checkout';
import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';

interface PaymentFormProps {
  amount: number;
  listingId: string;
  onBack: () => void;
  onNext: (paymentIntentId: string, clientSecret: string) => void;
}

export function PaymentForm({ amount, listingId, onBack, onNext }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
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
      const { clientSecret, paymentIntentId } = await createPaymentIntent(amount, listingId);

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

      // Payment successful, move to next step
      onNext(paymentIntentId, clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormTitle>Payment Details</FormTitle>

      <OrderAmount>
        <AmountLabel>Total Amount</AmountLabel>
        <AmountValue>{amount.toFixed(2)}€</AmountValue>
      </OrderAmount>

      <PaymentSection>
        <Label>Card Information</Label>
        <CardElementWrapper>
          <CardElement options={cardElementOptions} />
        </CardElementWrapper>
        {error && <ErrorText>{error}</ErrorText>}
      </PaymentSection>

      <TestModeNotice>
        <NoticeTitle>🧪 Test Mode</NoticeTitle>
        <NoticeText>
          Use test card: <code>4242 4242 4242 4242</code>
          <br />
          Any future expiry date, any 3-digit CVC
        </NoticeText>
      </TestModeNotice>

      <ButtonContainer>
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          Back
        </Button>
        <Button type="submit" variant="primary" disabled={!stripe || processing} isLoading={processing}>
          Review Order
        </Button>
      </ButtonContainer>
    </Form>
  );
}

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const OrderAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const AmountLabel = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const AmountValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary.main};

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
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.background.primary};
  transition: all 0.2s;

  &:focus-within {
    border-color: ${({ theme }) => theme.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary.light};
  }
`;

const ErrorText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.state.error};
  margin-top: 0.5rem;
`;

const TestModeNotice = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: 1rem;
`;

const NoticeTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;
`;

const NoticeText = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;

  code {
    padding: 0.125rem 0.375rem;
    background-color: ${({ theme }) => theme.background.primary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: monospace;
    font-size: 0.875rem;
  }
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
