import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';
import { breakpoint } from '@/lib/theme/breakpoints';

export const StepPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.border.primary};

  @media (max-width: ${breakpoint.sm}) {
    padding: 1.25rem;
  }
`;

export const StepTitle = styled(PageTitle).attrs({ as: 'h2' })`
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

export const StepCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

export const Amount = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};
`;
