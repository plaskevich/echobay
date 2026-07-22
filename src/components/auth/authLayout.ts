import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';
import { minFullContentHeight } from '@/components/layout/viewport';

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  ${minFullContentHeight}

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing.md} 0;
    justify-content: flex-start;
    min-height: 0;
  }
`;

export const AuthCard = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 450px;
  box-shadow: ${({ theme }) => theme.elevation.md};

  @media (max-height: 760px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
`;

export const AuthCardTitle = styled(PageTitle)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

export const AuthSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  line-height: ${({ theme }) => theme.lineHeight.normal};

  @media (max-width: 640px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const AuthFormLayout = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-height: 760px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const AuthErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.state.error}20;
  color: ${({ theme }) => theme.state.error};
  border: 1px solid ${({ theme }) => theme.state.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
