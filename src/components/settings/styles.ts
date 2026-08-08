import styled from 'styled-components';

import { Form as BaseForm } from '@/components/common/Form';
import { PageTitle } from '@/components/common/PageTitle';

export const Container = styled.div`
  flex: 1;
  width: 100%;
`;

export const SectionTitle = styled(PageTitle).attrs({ as: 'h2' })`
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0 0 1.5rem 0;
`;

export const Form = styled(BaseForm)`
  max-width: 480px;
  margin-top: 3rem;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    max-width: none;
  }
`;

export const Message = styled.p<{ $type: 'success' | 'error' }>`
  font-size: 0.875rem;
  color: ${({ theme, $type }) => ($type === 'success' ? theme.state.success : theme.state.error)};
  margin: 0;
`;
