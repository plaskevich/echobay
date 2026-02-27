import { PiCaretLeft } from 'react-icons/pi';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

import {
  ApplyButtonWrapper,
  CaretIcon,
  CheckboxList,
  DropdownApplyButton,
  DropdownMenu,
  FilterButton,
  FilterDropdownContainer,
  MobileHeader,
  MobileHeaderBack,
  MobileHeaderTitle,
  MobileOverlay,
  Radio,
  RadioItem,
} from './styles';

export type ListingSortOption = 'recommended' | 'newest' | 'cheapest' | 'most_expensive';

interface SortOption {
  value: ListingSortOption;
  label: string;
}

interface SortFilterProps {
  value: ListingSortOption;
  appliedValue: ListingSortOption;
  onChange: (value: ListingSortOption) => void;
  onApply: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const sortOptions: SortOption[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'cheapest', label: 'Price: low to high' },
  { value: 'most_expensive', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
];

export function SortFilter({ value, appliedValue, onChange, onApply, isOpen, onToggle }: SortFilterProps) {
  useBodyScrollLock(isOpen);

  return (
    <FilterDropdownContainer data-testid="filter-dropdown-sort">
      <FilterButton $active={appliedValue !== 'recommended'} onClick={onToggle}>
        Sort by
        <CaretIcon />
      </FilterButton>
      {isOpen && (
        <>
          <MobileOverlay onClick={onToggle} />
          <DropdownMenu>
            <MobileHeader>
              <MobileHeaderBack onClick={onToggle} aria-label="Close">
                <PiCaretLeft />
              </MobileHeaderBack>
              <MobileHeaderTitle>Sort</MobileHeaderTitle>
              <span />
            </MobileHeader>
            <CheckboxList>
              {sortOptions.map((option) => {
                const isChecked = value === option.value;
                return (
                  <RadioItem key={option.value} $checked={isChecked} onClick={() => onChange(option.value)}>
                    <span>{option.label}</span>
                    <Radio $checked={isChecked} />
                  </RadioItem>
                );
              })}
            </CheckboxList>
            <ApplyButtonWrapper>
              <DropdownApplyButton onClick={onApply} data-testid="filter-apply-button">
                Show results
              </DropdownApplyButton>
            </ApplyButtonWrapper>
          </DropdownMenu>
        </>
      )}
    </FilterDropdownContainer>
  );
}
