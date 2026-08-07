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
      <FilterButton $active={hasSelection} $open={isOpen} onClick={onToggle}>
        {label}
        <i className="hn hn-chevron-down" />
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
