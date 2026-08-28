import styled from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
  }
`;
