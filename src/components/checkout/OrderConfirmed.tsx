import { PiCheckCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../common/Button';

export default function OrderConfirmed() {
  const navigate = useNavigate();

  return (
    <SuccessContainer>
      <SuccessIcon>
        <PiCheckCircle size={80} />
      </SuccessIcon>
      <SuccessTitle>Order Confirmed!</SuccessTitle>
      <SuccessMessage>Thank you for your purchase. You will receive a confirmation email shortly</SuccessMessage>
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
`;

const SuccessIcon = styled.div`
  color: ${({ theme }) => theme.state.success};
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

const SuccessMessage = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;
