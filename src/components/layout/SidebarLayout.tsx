import styled from 'styled-components';

export const SidebarLayout = styled.div`
  width: 100%;
  margin: 4rem auto;
  display: flex;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SidebarTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 1.5rem 1rem;
`;

export const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: row;
    overflow-x: auto;
  }
`;

export const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.background.primary};
  border: none;
  color: ${({ theme, $active }) => ($active ? theme.text.accent : theme.text.primary)};
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  transition: color 0.2s ease-in-out;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
  }

  &:active {
    transform: translateY(1px);
  }
`;
