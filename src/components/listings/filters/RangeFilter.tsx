import styled from 'styled-components';

import type { ListingFilters } from '@/api/listings';
import { breakpoint } from '@/lib/theme/breakpoints';
import { useListingFiltersStore } from '@/store/listing-filters-store';

import { isRangeInvalid } from './utils';

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

const RangeInputs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
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
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  pointer-events: none;
  font-size: ${({ theme }) => theme.fontSize.sm};
  bottom: 0.6rem;
  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize.base};
    bottom: 0.75rem;
  }
`;

const RangeLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize.base};
  }
`;

const RangeInput = styled.input<{ $hasError?: boolean; $hasPrefix?: boolean }>`
  width: 80px;
  padding: 0.625rem ${({ theme }) => theme.spacing.sm};
  ${({ $hasPrefix }) => $hasPrefix && 'padding-left: 1.75rem;'}
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: all ${({ theme }) => theme.transition.base};

  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.background.elevated};
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.hover)};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: ${breakpoint.sm}) {
    width: 100%;
    padding: 0.875rem ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.base};
    ${({ $hasPrefix }) => $hasPrefix && 'padding-left: ${({ theme }) => theme.spacing.xl};'}
  }
`;

const ValidationError = styled.p`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.state.error};
  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    margin-top: -0.5rem;
    align-self: center;
  }
`;

const RangeSeparator = styled.span`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.fontSize.base};
  margin-top: 1.25rem;
`;
