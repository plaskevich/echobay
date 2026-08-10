import { Sidebar, SidebarItem, SidebarNav, SidebarTitle } from '@/components/layout/SidebarLayout';
import type { OrderFilter } from '@/pages/OrdersPage';

interface OrdersSidebarProps {
  filter: OrderFilter;
  setFilter: (filter: OrderFilter) => void;
}

const filters: { key: OrderFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'bought', label: 'Bought', icon: <i className="hn hn-shopping-cart" /> },
  { key: 'sold', label: 'Sold', icon: <i className="hn hn-tag" /> },
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
