import { useState } from 'react';

import { InfoMessage } from '@/components/common/Message';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
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
      <SidebarLayout>
        <InfoMessage>Please log in to view your orders</InfoMessage>
      </SidebarLayout>
    );
  }

  const orders = filter === 'bought' ? boughtOrders : soldOrders;
  const isLoading = filter === 'bought' ? isLoadingBought : isLoadingSold;

  return (
    <SidebarLayout>
      <OrdersSidebar filter={filter} setFilter={setFilter} />
      <OrdersContent isLoading={isLoading} orders={orders} filter={filter} />
    </SidebarLayout>
  );
}
