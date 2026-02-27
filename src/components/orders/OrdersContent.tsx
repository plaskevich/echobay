import styled from 'styled-components';

import type { Order } from '@/api/orders';
import OrderCard from '@/components/orders/OrderCard';
import type { OrderFilter } from '@/pages/OrdersPage';

interface OrdersContentProps {
  isLoading: boolean;
  orders: Order[];
  filter: OrderFilter;
}

export default function OrdersContent({ isLoading, orders, filter }: OrdersContentProps) {
  return (
    <OrdersSection>
      {isLoading ? (
        <LoadingText data-testid="orders-loading">Loading orders...</LoadingText>
      ) : orders.length === 0 ? (
        <EmptyText data-testid="orders-empty">No {filter} orders found</EmptyText>
      ) : (
        <OrdersList data-testid="orders-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </OrdersList>
      )}
    </OrdersSection>
  );
}

const OrdersSection = styled.div`
  flex: 1;
`;

const LoadingText = styled.p`
  color: ${(props) => props.theme.text.secondary};
`;

const EmptyText = styled.p`
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
  padding: 2rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
