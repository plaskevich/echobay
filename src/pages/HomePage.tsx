import styled from 'styled-components';

import { ListingsView } from '@/components/listings/ListingsView';
import { breakpoint } from '@/lib/theme/breakpoints';

export default function HomePage() {
  return (
    <Container>
      <ListingsView />
    </Container>
  );
}

const Container = styled.div`
  @media (max-width: ${breakpoint.md}) {
    padding: 0 ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;
