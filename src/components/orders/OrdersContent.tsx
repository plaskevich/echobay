import styled from 'styled-components';

import type { Order } from '@/api/orders';
import { EmptyState, LoadingState } from '@/components/common/StateDisplay';
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
        <LoadingState message="Loading orders" data-testid="orders-loading" />
      ) : orders.length === 0 ? (
        <EmptyState message={`No ${filter} orders found`} data-testid="orders-empty" />
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

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
