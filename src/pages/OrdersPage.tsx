import { useState } from 'react';
import styled from 'styled-components';

import { InfoMessage } from '@/components/common/Message';
import OrdersContent from '@/components/orders/OrdersContent';
import OrdersSidebar from '@/components/orders/OrdersSidebar';
import { useBoughtOrders, useSoldOrders } from '@/queries/useOrders';
import { useAuthStore } from '@/store/auth-store';

export type OrderFilter = 'sold' | 'bought';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<OrderFilter>('bought');
  const { data: boughtOrders = [], isLoading: isLoadingBought } = useBoughtOrders(user?.id);
  const { data: soldOrders = [], isLoading: isLoadingSold } = useSoldOrders(user?.id);

  if (!user) {
    return (
      <Container>
        <InfoMessage>Please log in to view your orders</InfoMessage>
      </Container>
    );
  }

  const orders = filter === 'bought' ? boughtOrders : soldOrders;
  const isLoading = filter === 'bought' ? isLoadingBought : isLoadingSold;

  return (
    <Container>
      <Header>
        <Title>Orders</Title>
      </Header>
      <Content>
        <OrdersSidebar filter={filter} setFilter={setFilter} />
        <OrdersContent isLoading={isLoading} orders={orders} filter={filter} />
      </Content>
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

const Content = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
