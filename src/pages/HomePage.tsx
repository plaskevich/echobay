import styled from 'styled-components';

import { ListingsView } from '@/components/listings/ListingsView';

export default function HomePage() {
  return (
    <Container>
      <ListingsView />
    </Container>
  );
}

const Container = styled.div`
  @media (max-width: 768px) {
    padding: 0 0.75rem 1rem;
  }
`;
