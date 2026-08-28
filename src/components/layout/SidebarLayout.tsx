import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';
import { breakpoint } from '@/lib/theme/breakpoints';

export const SidebarLayout = styled.div`
  width: 100%;
  margin: ${({ theme }) => theme.spacing['3xl']} auto;
  display: flex;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: flex-start;

  @media (max-width: ${breakpoint.md}) {
    flex-direction: column;
    align-items: stretch;
    margin: 0 auto;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;

  @media (max-width: ${breakpoint.md}) {
    min-width: 0;
  }
`;

export const SidebarTitle = styled(PageTitle)`
  margin-bottom: 1.2rem;

  @media (max-width: ${breakpoint.md}) {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  }
`;

export const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${breakpoint.md}) {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, $active }) => ($active ? theme.black.main : 'transparent')};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.black.main : theme.border.primary)};
  color: ${({ theme, $active }) => ($active ? theme.text.inverse : theme.text.primary)};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ $active, theme }) => ($active ? theme.fontWeight.semibold : theme.fontWeight.medium)};
  transition: all ${({ theme }) => theme.transition.slow};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.border.hover};
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: ${breakpoint.md}) {
    justify-content: center;
    text-align: center;
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
    white-space: normal;
  }
`;
