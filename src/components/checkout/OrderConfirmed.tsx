import { PiCheckCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../common/Button';

export function OrderConfirmed() {
  const navigate = useNavigate();

  return (
    <SuccessContainer>
      <SuccessIcon>
        <PiCheckCircle size={80} />
      </SuccessIcon>
      <SuccessTitle>Order Confirmed!</SuccessTitle>
      <SuccessMessage>
        Thank you for your purchase. The seller has been notified and will prepare your item for shipping.
      </SuccessMessage>
      <Button onClick={() => navigate('/')}>Continue shopping</Button>
    </SuccessContainer>
  );
}

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  padding: 2rem 1rem;

  @media (max-width: 640px) {
    gap: 1rem;
    padding: 1.5rem 0.75rem;
  }
`;

const SuccessIcon = styled.div`
  color: ${({ theme }) => theme.state.success};
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const SuccessMessage = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;
