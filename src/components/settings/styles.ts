import styled from 'styled-components';

import { Form as BaseForm } from '@/components/common/Form';
import { PageTitle } from '@/components/common/PageTitle';
import { breakpoint } from '@/lib/theme/breakpoints';

export const Container = styled.div`
  flex: 1;
  width: 100%;
`;

export const SectionTitle = styled(PageTitle).attrs({ as: 'h2' })`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

export const Form = styled(BaseForm)`
  max-width: 480px;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;

  @media (max-width: ${breakpoint.md}) {
    margin-top: ${({ theme }) => theme.spacing.lg};
    max-width: none;
  }
`;

export const Message = styled.p<{ $type: 'success' | 'error' }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $type }) => ($type === 'success' ? theme.state.success : theme.state.error)};
  margin: 0;
`;
