import { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { FormGroup, Label } from '@/components/common/Form';
import { MultiSelect, type MultiSelectOption } from '@/components/common/MultiSelect';
import { useMainGenres, useSubgenres } from '@/queries/useGenres';

interface GenreSelectorProps {
  selectedMainGenreIds: string[];
  selectedSubgenreIds: string[];
  onMainGenresChange: (ids: string[]) => void;
  onSubgenresChange: (ids: string[]) => void;
  disabled?: boolean;
  maxMainGenres?: number;
  maxSubgenres?: number;
}

export function GenreSelector({
  selectedMainGenreIds,
  selectedSubgenreIds,
  onMainGenresChange,
  onSubgenresChange,
  disabled = false,
  maxMainGenres = 3,
  maxSubgenres = 5,
}: GenreSelectorProps) {
  const { data: mainGenres = [] } = useMainGenres();
  const { data: allSubgenres = [] } = useSubgenres();

  const availableSubgenres = useMemo(() => {
    if (selectedMainGenreIds.length === 0) {
      return [];
    }
    return allSubgenres.filter((subgenre) => subgenre.parent_id && selectedMainGenreIds.includes(subgenre.parent_id));
  }, [allSubgenres, selectedMainGenreIds]);

  useEffect(() => {
    if (selectedSubgenreIds.length === 0) return;

    const validSubgenreIds = new Set(availableSubgenres.map((s) => s.id));
    const filteredSubgenres = selectedSubgenreIds.filter((id) => validSubgenreIds.has(id));

    if (filteredSubgenres.length !== selectedSubgenreIds.length) {
      onSubgenresChange(filteredSubgenres);
    }
  }, [availableSubgenres, selectedSubgenreIds, onSubgenresChange]);

  const mainGenreOptions: MultiSelectOption[] = mainGenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  const subgenreOptions: MultiSelectOption[] = availableSubgenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  return (
    <Container>
      <FormGroup>
        <Label>Genre</Label>
        <MultiSelect
          options={mainGenreOptions}
          selectedValues={selectedMainGenreIds}
          onChange={onMainGenresChange}
          placeholder="Select main genres..."
          disabled={disabled}
          maxSelections={maxMainGenres}
        />
        <HelpText>Select up to {maxMainGenres} main genres</HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Subgenre</Label>
        <MultiSelect
          options={subgenreOptions}
          selectedValues={selectedSubgenreIds}
          onChange={onSubgenresChange}
          placeholder={selectedMainGenreIds.length === 0 ? 'Select main genres first...' : 'Select subgenres...'}
          disabled={disabled || selectedMainGenreIds.length === 0}
          maxSelections={maxSubgenres}
        />
        <HelpText>
          {selectedMainGenreIds.length === 0
            ? 'Choose main genres to see available subgenres'
            : `Select up to ${maxSubgenres} subgenres`}
        </HelpText>
      </FormGroup>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const HelpText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 0.25rem;
`;
