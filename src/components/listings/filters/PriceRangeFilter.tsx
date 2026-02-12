import styled from 'styled-components';

import {
  ApplyButtonWrapper,
  CaretIcon,
  DropdownApplyButton,
  DropdownMenu,
  FilterButton,
  FilterDropdownContainer,
} from './styles';

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (min?: number, max?: number) => void;
  onApply: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PriceRangeFilter({ minPrice, maxPrice, onChange, onApply, isOpen, onToggle }: PriceRangeFilterProps) {
  const hasValue = minPrice !== undefined || maxPrice !== undefined;
  const hasInvalidRange = minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice;

  const getLabel = () => {
    if (!hasValue) return 'Price Range';
    return `${minPrice ?? 0}€ - ${maxPrice ?? '∞'}€`;
  };

  return (
    <FilterDropdownContainer>
      <FilterButton $active={hasValue} onClick={onToggle}>
        {getLabel()}
        <CaretIcon />
      </FilterButton>
      {isOpen && (
        <DropdownMenu>
          <PriceInputs>
            <PriceInputWrapper>
              <PriceLabel>Min</PriceLabel>
              <PriceInput
                type="number"
                placeholder="0"
                value={minPrice ?? ''}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
                min={0}
                $hasError={hasInvalidRange}
              />
            </PriceInputWrapper>
            <PriceSeparator>-</PriceSeparator>
            <PriceInputWrapper>
              <PriceLabel>Max</PriceLabel>
              <PriceInput
                type="number"
                placeholder="Any"
                value={maxPrice ?? ''}
                onChange={(e) => onChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
                min={0}
                $hasError={hasInvalidRange}
              />
            </PriceInputWrapper>
          </PriceInputs>
          {hasInvalidRange && <ValidationError>Min price must be less than max</ValidationError>}
          <ApplyButtonWrapper>
            <DropdownApplyButton onClick={onApply} disabled={hasInvalidRange}>
              Apply
            </DropdownApplyButton>
          </ApplyButtonWrapper>
        </DropdownMenu>
      )}
    </FilterDropdownContainer>
  );
}

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
`;

const PriceInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const PriceLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

const PriceInput = styled.input<{ $hasError?: boolean }>`
  width: 80px;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.primary.main)};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.primary.light)};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ValidationError = styled.p`
  padding: 0 0.75rem;
  margin: 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.state.error};
`;

const PriceSeparator = styled.span`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 1rem;
  margin-top: 1.25rem;
`;
