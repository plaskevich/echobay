import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';

import { Button } from '../common/Button';

export function OrderConfirmed() {
  const navigate = useNavigate();

  return (
    <SuccessContainer data-testid="order-confirmed">
      <SuccessIcon className="hn hn-badge-check" aria-hidden />
      <SuccessTitle data-testid="order-confirmed-title">Order Confirmed!</SuccessTitle>
      <SuccessMessage data-testid="order-confirmed-message">
        Thank you for your purchase. The seller has been notified and will prepare your item for shipping.
      </SuccessMessage>
      <Button onClick={() => navigate('/')} data-testid="order-confirmed-continue">
        Continue shopping
      </Button>
    </SuccessContainer>
  );
}

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0 auto;
  text-align: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${breakpoint.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
  }
`;

const SuccessIcon = styled.i`
  font-size: 3.75rem;
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};
`;

const SuccessTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const SuccessMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin: 0;
  max-width: 25rem;
`;
