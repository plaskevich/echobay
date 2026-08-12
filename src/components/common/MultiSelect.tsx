import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import { useClickOutside } from '@/hooks/useClickOutside';
import { ellipsis } from '@/lib/theme/mixins';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxSelections?: number;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  maxSelections,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

  const filteredOptions = options.filter(
    (opt) => !selectedValues.includes(opt.value) && opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = useCallback(
    (value: string) => {
      if (maxSelections && selectedValues.length >= maxSelections) return;
      onChange([...selectedValues, value]);
      setSearchTerm('');
      inputRef.current?.focus();
    },
    [selectedValues, onChange, maxSelections]
  );

  const handleRemove = useCallback(
    (value: string) => {
      onChange(selectedValues.filter((v) => v !== value));
    },
    [selectedValues, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && searchTerm === '' && selectedValues.length > 0) {
        handleRemove(selectedValues[selectedValues.length - 1]);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if (e.key === 'Enter' && filteredOptions.length > 0) {
        e.preventDefault();
        handleSelect(filteredOptions[0].value);
      }
    },
    [searchTerm, selectedValues, filteredOptions, handleRemove, handleSelect]
  );

  useClickOutside(
    containerRef,
    useCallback(() => setIsOpen(false), [])
  );

  return (
    <Container ref={containerRef}>
      <InputContainer
        $isOpen={isOpen}
        $disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <TagsContainer>
          {selectedOptions.map((opt) => (
            <Tag key={opt.value}>
              <TagLabel>{opt.label}</TagLabel>
              {!disabled && (
                <TagRemove
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(opt.value);
                  }}
                  aria-label={`Remove ${opt.label}`}
                >
                  <i className="hn hn-times" aria-hidden />
                </TagRemove>
              )}
            </Tag>
          ))}
          <SearchInput
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length === 0 ? placeholder : ''}
            disabled={disabled}
          />
        </TagsContainer>
        <CaretIcon className="hn hn-chevron-down" $isOpen={isOpen} aria-hidden />
      </InputContainer>

      {isOpen && filteredOptions.length > 0 && (
        <Dropdown>
          {filteredOptions.map((opt) => (
            <DropdownItem
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              $disabled={maxSelections !== undefined && selectedValues.length >= maxSelections}
            >
              {opt.label}
            </DropdownItem>
          ))}
        </Dropdown>
      )}

      {isOpen && filteredOptions.length === 0 && searchTerm && (
        <Dropdown>
          <NoResults>No matching genres found</NoResults>
        </Dropdown>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div<{ $isOpen: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${({ theme, $isOpen }) => ($isOpen ? theme.border.hover : theme.border.primary)};
  background-color: ${({ theme, $isOpen }) => ($isOpen ? theme.background.elevated : theme.background.primary)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'text')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: all ${({ theme }) => theme.transition.base};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.1rem;
  flex: 1;
  align-items: center;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  color: ${({ theme }) => theme.primary.main};
  font-size: 0.875rem;
  font-weight: 500;
`;

const TagLabel = styled.span`
  max-width: 150px;
  ${ellipsis}
`;

const TagRemove = styled.button`
  font-size: 0.875rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.primary.main};
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transition.fast};

  &:hover {
    opacity: 1;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 60px;
  padding: 0.25rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.text.primary};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const CaretIcon = styled.i<{ $isOpen: boolean }>`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1;
  transition: transform ${({ theme }) => theme.transition.base};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  flex-shrink: 0;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.background.elevated};
  border: 1px solid ${({ theme }) => theme.border.hover};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 100;
`;

const DropdownItem = styled.div<{ $disabled?: boolean }>`
  padding: 0.75rem 1rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  color: ${({ theme, $disabled }) => ($disabled ? theme.text.tertiary : theme.text.primary)};
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme, $disabled }) => ($disabled ? 'transparent' : theme.background.secondary)};
  }
`;

const NoResults = styled.div`
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.text.tertiary};
  font-style: italic;
`;
