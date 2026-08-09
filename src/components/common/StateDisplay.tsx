import type { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

import { Spinner } from '@/components/common/Spinner';

interface StateDisplayProps {
  message: string;
  'data-testid'?: string;
}

interface EmptyStateProps extends Partial<StateDisplayProps> {
  icon?: ReactNode;
  title?: string;
}

export function LoadingState({ message = 'Loading', ...rest }: Partial<StateDisplayProps>) {
  return (
    <LoadingContainer role="status" aria-label={message} {...rest}>
      <Spinner size="3rem" />
    </LoadingContainer>
  );
}

export function EmptyState({ message, icon, title, ...rest }: EmptyStateProps) {
  if (icon || title) {
    return (
      <EmptyStateContainer {...rest}>
        {icon && <EmptyStateIcon>{icon}</EmptyStateIcon>}
        {title && <EmptyStateTitle>{title}</EmptyStateTitle>}
        {message && <EmptyStateMessage>{message}</EmptyStateMessage>}
      </EmptyStateContainer>
    );
  }
  return <CenteredStateText {...rest}>{message}</CenteredStateText>;
}

export function ErrorState({ message, ...rest }: StateDisplayProps) {
  return <ErrorText {...rest}>{message}</ErrorText>;
}

const appear = keyframes`
  to { opacity: 1; }
`;

const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.primary.main};
  opacity: 0;
  animation: ${appear} 0.2s ease-out 0.5s forwards;
`;

const CenteredStateText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.state.error};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  display: flex;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing['2xs']};
`;

const EmptyStateTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
`;

const EmptyStateMessage = styled.p`
  margin: 0;
  max-width: 32rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;
