import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';

export const StepPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border.primary};

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

export const StepTitle = styled(PageTitle).attrs({ as: 'h2' })`
  font-size: 1.25rem;
`;

export const StepCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

export const Amount = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};
`;
