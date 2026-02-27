import { PiShoppingCart, PiStorefront } from 'react-icons/pi';

import { Sidebar, SidebarItem, SidebarNav, SidebarTitle } from '@/components/layout/SidebarLayout';
import type { OrderFilter } from '@/pages/OrdersPage';

interface OrdersSidebarProps {
  filter: OrderFilter;
  setFilter: (filter: OrderFilter) => void;
}

const filters: { key: OrderFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'bought', label: 'Bought', icon: <PiShoppingCart size={20} /> },
  { key: 'sold', label: 'Sold', icon: <PiStorefront size={20} /> },
];

export default function OrdersSidebar({ filter, setFilter }: OrdersSidebarProps) {
  return (
    <Sidebar>
      <SidebarTitle>Orders</SidebarTitle>
      <SidebarNav>
        {filters.map(({ key, label, icon }) => (
          <SidebarItem
            key={key}
            data-testid={`orders-filter-${key}`}
            $active={filter === key}
            onClick={() => setFilter(key)}
          >
            {icon}
            {label}
          </SidebarItem>
        ))}
      </SidebarNav>
    </Sidebar>
  );
}
