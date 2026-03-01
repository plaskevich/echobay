import styled from 'styled-components';

import type { ListingFilters } from '@/api/listings';
import { useListingFiltersStore } from '@/store/listing-filters-store';

import { isRangeInvalid } from './utils';

const RangeInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;

  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }
`;

const RangeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
`;

const RangeInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputPrefix = styled.span`
  position: absolute;
  left: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  pointer-events: none;
  font-size: 0.875rem;
  bottom: 0.6rem;
  @media (max-width: 640px) {
    font-size: 1rem;
    bottom: 0.75rem;
  }
`;

const RangeLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const RangeInput = styled.input<{ $hasError?: boolean; $hasPrefix?: boolean }>`
  width: 80px;
  padding: 0.625rem 0.75rem;
  ${({ $hasPrefix }) => $hasPrefix && 'padding-left: 1.75rem;'}
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

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    ${({ $hasPrefix }) => $hasPrefix && 'padding-left: 2rem;'}
  }
`;

const ValidationError = styled.p`
  padding: 0 0.75rem;
  margin: 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.state.error};
  @media (max-width: 640px) {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    margin-top: -0.5rem;
    align-self: center;
  }
`;

const RangeSeparator = styled.span`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 1rem;
  margin-top: 1.25rem;
`;

interface RangeFilterProps {
  filterKey: keyof ListingFilters;
  placeholderMin?: string;
  placeholderMax?: string;
  prefixLabel?: string;
  hasError?: boolean;
  errorMessage?: string;
  inputMin?: number;
}

export function RangeFilter({
  filterKey,
  placeholderMin = 'Any',
  placeholderMax = 'Any',
  prefixLabel,
  hasError,
  errorMessage,
  inputMin = 0,
}: RangeFilterProps) {
  const { filters, setFilters } = useListingFiltersStore();
  const currentRange = filters[filterKey] as { min?: number; max?: number };

  const hasInvalidRange = isRangeInvalid(currentRange?.min, currentRange?.max);

  const handleChange = (min?: number, max?: number) => {
    setFilters({ ...filters, [filterKey]: { min, max } });
  };

  return (
    <>
      <RangeInputs>
        <RangeInputWrapper>
          <RangeLabel>From</RangeLabel>
          <RangeInputContainer>
            {prefixLabel && <InputPrefix>{prefixLabel}</InputPrefix>}
            <RangeInput
              type="number"
              placeholder={placeholderMin}
              value={currentRange?.min ?? ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                handleChange(value, currentRange?.max);
              }}
              min={inputMin}
              $hasError={hasError}
              $hasPrefix={Boolean(prefixLabel)}
              data-testid={`${filterKey}-min-input`}
            />
          </RangeInputContainer>
        </RangeInputWrapper>
        <RangeSeparator>-</RangeSeparator>
        <RangeInputWrapper>
          <RangeLabel>To</RangeLabel>
          <RangeInputContainer>
            {prefixLabel && <InputPrefix>{prefixLabel}</InputPrefix>}
            <RangeInput
              type="number"
              placeholder={placeholderMax}
              value={currentRange?.max ?? ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                handleChange(currentRange?.min, value);
              }}
              min={inputMin}
              $hasError={hasError}
              $hasPrefix={Boolean(prefixLabel)}
              data-testid={`${filterKey}-max-input`}
            />
          </RangeInputContainer>
        </RangeInputWrapper>
      </RangeInputs>
      {hasInvalidRange && errorMessage && <ValidationError>{errorMessage}</ValidationError>}
    </>
  );
}
