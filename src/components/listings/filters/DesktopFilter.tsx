import { PiCaretDown } from 'react-icons/pi';

import {
  ApplyButtonWrapper,
  DropdownApplyButton,
  DropdownMenu,
  FilterButton,
  FilterDropdownContainer,
} from '@/components/listings/filters/styles';

interface DesktopFilterProps {
  label: string;
  hasSelection: boolean;
  onToggle: () => void;
  isOpen: boolean;
  children: React.ReactNode;
  onApply: () => void;
  testId?: string;
}
export default function DesktopFilter({
  label,
  hasSelection,
  onToggle,
  isOpen,
  children,
  onApply,
  testId,
}: DesktopFilterProps) {
  return (
    <FilterDropdownContainer data-testid={testId ?? `filter-dropdown-${label.toLowerCase()}`}>
      <FilterButton $active={hasSelection} onClick={onToggle}>
        {label}
        <PiCaretDown />
      </FilterButton>
      {isOpen && (
        <DropdownMenu>
          {children}
          <ApplyButtonWrapper>
            <DropdownApplyButton onClick={onApply} data-testid="filter-apply-button">
              Show results
            </DropdownApplyButton>
          </ApplyButtonWrapper>
        </DropdownMenu>
      )}
    </FilterDropdownContainer>
  );
}
