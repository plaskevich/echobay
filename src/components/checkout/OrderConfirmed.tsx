import { PiCheckCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { Button } from '../common/Button';

export function OrderConfirmed() {
  const navigate = useNavigate();

  return (
    <SuccessContainer data-testid="order-confirmed">
      <SuccessIcon>
        <PiCheckCircle size={80} />
      </SuccessIcon>
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

const containerRise = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const iconPop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  60% {
    opacity: 1;
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
  }
`;

const haloPulse = keyframes`
  0% {
    opacity: 0.45;
    transform: scale(0.8);
  }
  70% {
    opacity: 0;
    transform: scale(1.9);
  }
  100% {
    opacity: 0;
    transform: scale(1.9);
  }
`;

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
  animation: ${containerRise} ${({ theme }) => theme.duration.slow} ${({ theme }) => theme.easing.emphasized} both;

  @media (max-width: 640px) {
    gap: 1rem;
    padding: 1.5rem 0.75rem;
  }
`;

const SuccessIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.state.success};
  animation: ${iconPop} 480ms ${({ theme }) => theme.easing.emphasized} 80ms both;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 72px;
    height: 72px;
    margin: -36px 0 0 -36px;
    background-color: ${({ theme }) => theme.state.success};
    z-index: -1;
    animation: ${haloPulse} 900ms ${({ theme }) => theme.easing.standard} 220ms both;
  }
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
