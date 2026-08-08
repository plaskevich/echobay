import styled from 'styled-components';

export const FilterDropdownContainer = styled.div`
  position: relative;
`;

export const FilterButton = styled.button<{ $active?: boolean; $open?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.border.hover : theme.border.primary)};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: all ${({ theme }) => theme.transition.base};
  white-space: nowrap;
  &:hover {
    border-color: ${({ theme, $active }) => ($active ? theme.black.main : theme.border.hover)};
  }

  i {
    font-size: 0.75rem;
    transition: all ${({ theme }) => theme.transition.base};
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    @media (max-width: 640px) {
      display: none;
    }
  }
`;

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
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 100;

  @media (max-width: 640px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: none;
    min-width: 0;
    border: none;
    box-shadow: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.background.primary};
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

export const SearchInputWrapper = styled.div`
  position: sticky;
  top: -0.4rem;
  z-index: 1;
  margin: -0.4rem -0.4rem 0 -0.4rem;
  padding: 0.75rem 0.75rem 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.background.primary};

  @media (max-width: 640px) {
    position: static;
    margin: 0;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
    flex-shrink: 0;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.background.elevated};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
  outline: none;
  transition: border-color ${({ theme }) => theme.transition.fast};
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
    opacity: 0.6;
  }

  &:focus {
    border-color: ${({ theme }) => theme.border.hover};
  }

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;

export const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }
`;

export const CheckboxItem = styled.div<{ $checked?: boolean; $empty?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $empty }) => ($empty ? 'center' : 'space-between')};
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  cursor: ${({ $empty }) => ($empty ? 'default' : 'pointer')};
  opacity: ${({ $empty }) => ($empty ? 0.5 : 1)};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ $checked }) => ($checked ? 600 : 400)};
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
  }

  span {
    flex: 1;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    font-size: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  }
`;

export const ApplyButtonWrapper = styled.div`
  position: sticky;
  bottom: -0.4rem;
  z-index: 2;
  margin: 0 -0.4rem -0.4rem -0.4rem;
  padding: 0.5rem 0.75rem 0.75rem 0.75rem;
  background-color: ${({ theme }) => theme.background.primary};

  @media (max-width: 640px) {
    position: static;
    margin: 0;
    padding: 1rem;
    flex-shrink: 0;
    border-top: 1px solid ${({ theme }) => theme.border.primary};
  }
`;

export const DropdownApplyButton = styled.button`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.black.main};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.black.light};
  }

  @media (max-width: 640px) {
    padding: 1rem;
    font-size: 1rem;
    border: none;
  }
`;

export const Checkbox = styled.div<{ $checked?: boolean }>`
  width: 1rem;
  height: 1rem;
  border: 1px solid ${({ theme, $checked }) => ($checked ? theme.black.main : theme.border.primary)};
  background-color: ${({ theme, $checked }) => ($checked ? theme.black.main : theme.background.primary)};
  transition: all ${({ theme }) => theme.transition.fast};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.text.inverse};
  font-size: 0.75rem;

  @media (max-width: 640px) {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.875rem;
  }
`;

export const RadioItem = styled.div<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ $checked }) => ($checked ? 600 : 400)};
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
  }

  span {
    flex: 1;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    font-size: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  }
`;

export const Radio = styled.div<{ $checked?: boolean }>`
  width: 1rem;
  height: 1rem;
  border: 1px solid ${({ theme, $checked }) => ($checked ? theme.black.main : theme.border.primary)};
  background-color: ${({ theme }) => theme.background.primary};
  transition: all ${({ theme }) => theme.transition.fast};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background-color: ${({ theme }) => theme.black.main};
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    transition: opacity ${({ theme }) => theme.transition.fast};
  }

  @media (max-width: 640px) {
    width: 1.25rem;
    height: 1.25rem;

    &::after {
      width: 0.625rem;
      height: 0.625rem;
    }
  }
`;
