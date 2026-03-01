import { useCallback } from 'react';

import { useListingFiltersStore } from '@/store/listing-filters-store';

import { CheckboxList, Radio, RadioItem } from './styles';
import { type ListingSortOption, SORT_OPTIONS } from './utils';

export function SortFilter() {
  const { filters, setFilters } = useListingFiltersStore();
  const selectedSort = filters.sortBy;
  const handleChange = useCallback(
    (value: ListingSortOption) => {
      setFilters({ ...filters, sortBy: value });
    },
    [filters, setFilters]
  );
  return (
    <CheckboxList>
      {SORT_OPTIONS.map((option) => {
        const isChecked = selectedSort === option.value;
        return (
          <RadioItem key={option.value} $checked={isChecked} onClick={() => handleChange(option.value)}>
            <span>{option.label}</span>
            <Radio $checked={isChecked} />
          </RadioItem>
        );
      })}
    </CheckboxList>
  );
}
