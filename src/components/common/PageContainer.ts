import styled from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';

export const PageContainer = styled.div`
  padding-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${breakpoint.md}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;
