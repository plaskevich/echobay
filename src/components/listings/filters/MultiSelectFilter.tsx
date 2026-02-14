import { useEffect, useMemo, useRef, useState } from 'react';
import { PiCaretLeft } from 'react-icons/pi';

import {
  ApplyButtonWrapper,
  CaretIcon,
  Checkbox,
  CheckboxItem,
  CheckboxList,
  DropdownApplyButton,
  DropdownMenu,
  FilterButton,
  FilterDropdownContainer,
  MobileHeader,
  MobileHeaderAction,
  MobileHeaderBack,
  MobileHeaderTitle,
  MobileOverlay,
  SearchInput,
  SearchInputWrapper,
} from './styles';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  appliedValues: string[];
  onChange: (values: string[]) => void;
  onApply: () => void;
  isOpen: boolean;
  onToggle: () => void;
  searchable?: boolean;
}

export function MultiSelectFilter({
  label,
  options,
  selectedValues,
  appliedValues,
  onChange,
  onApply,
  isOpen,
  onToggle,
  searchable,
}: MultiSelectFilterProps) {
  const hasSelection = appliedValues.length > 0;
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      setSearchQuery('');
    }
    onToggle();
  };

  const handleClear = () => {
    onChange([]);
  };

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <FilterDropdownContainer>
      <FilterButton $active={hasSelection} onClick={handleToggle}>
        {label}
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
              <MobileHeaderTitle>{label}</MobileHeaderTitle>
              <MobileHeaderAction onClick={handleClear}>Clear</MobileHeaderAction>
            </MobileHeader>
            {searchable && (
              <SearchInputWrapper>
                <SearchInput
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInputWrapper>
            )}
            <CheckboxList>
              {filteredOptions.map((opt) => {
                const isChecked = selectedValues.includes(opt.value);
                return (
                  <CheckboxItem key={opt.value} $checked={isChecked} onClick={() => toggleValue(opt.value)}>
                    <span>{opt.label}</span>
                    <Checkbox $checked={isChecked} />
                  </CheckboxItem>
                );
              })}
              {searchable && filteredOptions.length === 0 && (
                <CheckboxItem as="div" style={{ cursor: 'default', opacity: 0.5, justifyContent: 'center' }}>
                  <span>No results found</span>
                </CheckboxItem>
              )}
            </CheckboxList>
            <ApplyButtonWrapper>
              <DropdownApplyButton onClick={onApply}>Show results</DropdownApplyButton>
            </ApplyButtonWrapper>
          </DropdownMenu>
        </>
      )}
    </FilterDropdownContainer>
  );
}
