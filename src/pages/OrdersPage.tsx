import styled from 'styled-components';

import { InfoMessage } from '@/components/common/Message';
import { useAuthStore } from '@/store/auth-store';

export default function OrdersPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <Container>
        <InfoMessage>Please log in to view your orders.</InfoMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Orders</Title>
      </Header>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
  margin: 0 0 0.5rem 0;
`;
