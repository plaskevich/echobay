import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';

export const SidebarLayout = styled.div`
  width: 100%;
  margin: 4rem auto;
  display: flex;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin: 0 auto;
    gap: 1.5rem;
    padding: 1rem 0.75rem;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 0;
  }
`;

export const SidebarTitle = styled(PageTitle)`
  margin-bottom: 1.2rem;

  @media (max-width: 768px) {
    margin: 0 0 1rem 0;
  }
`;

export const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

export const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme, $active }) => ($active ? theme.black.main : 'transparent')};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.black.main : theme.border.primary)};
  color: ${({ theme, $active }) => ($active ? theme.text.inverse : theme.text.primary)};
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  transition: all ${({ theme }) => theme.transition.slow};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.border.hover};
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
    white-space: normal;
  }
`;
