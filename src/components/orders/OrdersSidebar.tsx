import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import type { OrderFilter } from '@/pages/OrdersPage';

interface OrdersSidebarProps {
  filter: OrderFilter;
  setFilter: (filter: OrderFilter) => void;
}

export default function OrdersSidebar({ filter, setFilter }: OrdersSidebarProps) {
  return (
    <Sidebar>
      <FilterButton variant={filter === 'bought' ? 'primary' : 'ghost'} onClick={() => setFilter('bought')} fullWidth>
        Bought
      </FilterButton>
      <FilterButton variant={filter === 'sold' ? 'primary' : 'ghost'} onClick={() => setFilter('sold')} fullWidth>
        Sold
      </FilterButton>
    </Sidebar>
  );
}

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;

const FilterButton = styled(Button)`
  justify-content: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;
