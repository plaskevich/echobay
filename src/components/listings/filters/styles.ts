import { PiCaretDown } from 'react-icons/pi';
import styled from 'styled-components';

export const FilterDropdownContainer = styled.div`
  position: relative;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.primary.main : theme.border.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $active }) => ($active ? theme.primary.light : theme.background.primary)};
  color: ${({ theme, $active }) => ($active ? theme.primary.main : theme.text.primary)};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.primary.main};
    background-color: ${({ theme }) => theme.primary.light};
    color: ${({ theme }) => theme.primary.main};
  }

  svg {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }
`;

export const CaretIcon = styled(PiCaretDown)``;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.4rem;
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 6px 12px -6px ${({ theme }) => theme.shadow.medium};
  z-index: 100;
`;

export const ClearOption = styled.button`
  width: 100%;
  padding: 0.6rem 0.75rem;
  margin-top: 0.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.state.error};
  font-size: 0.875rem;
  text-align: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: color-mix(in srgb, ${({ theme }) => theme.state.error} 8%, transparent);
  }
`;

export const SearchInputWrapper = styled.div`
  position: sticky;
  top: -0.4rem;
  z-index: 1;
  margin: -0.4rem -0.4rem 0 -0.4rem;
  padding: 0.4rem 0.4rem 0.25rem 0.4rem;
  background-color: ${({ theme }) => theme.background.primary};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
    opacity: 0.6;
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary.main};
  }
`;

export const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CheckboxItem = styled.div<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme, $checked }) => ($checked ? theme.primary.main : theme.text.secondary)};
  font-weight: ${({ $checked }) => ($checked ? 500 : 400)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary.light};
    color: ${({ theme }) => theme.primary.main};
  }

  span {
    flex: 1;
  }
`;

export const ApplyButtonWrapper = styled.div`
  position: sticky;
  bottom: -0.4rem;
  z-index: 2;
  margin: 0 -0.4rem -0.4rem -0.4rem;
  padding: 0.25rem 0.4rem 0.4rem 0.4rem;
  background-color: ${({ theme }) => theme.background.primary};
`;

export const DropdownApplyButton = styled.button`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.primary.main};
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary.hover};
  }
`;

export const Checkbox = styled.div<{ $checked?: boolean }>`
  width: 1rem;
  height: 1rem;
  border: 1.5px solid ${({ theme, $checked }) => ($checked ? theme.primary.main : theme.border.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $checked }) => ($checked ? theme.primary.main : theme.background.primary)};
  transition: all 0.15s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 1rem;
    height: 1rem;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
`;
