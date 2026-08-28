import styled from 'styled-components';

import type { GenreRef } from '@/api/genres';
import { breakpoint } from '@/lib/theme/breakpoints';
import { capitalize, getFormatLabel } from '@/lib/utils';

interface ListingInfoProps {
  format?: string;
  condition?: string;
  genres?: GenreRef[];
  label?: string;
  year?: number | null;
}

export function ListingInfo({ format, condition, genres, label, year }: ListingInfoProps) {
  return (
    <InfoGrid>
      {format && (
        <InfoItem>
          <InfoLabel>Format</InfoLabel>
          <InfoValue data-testid="listing-format">{getFormatLabel(format)}</InfoValue>
        </InfoItem>
      )}
      {condition && (
        <InfoItem>
          <InfoLabel>Condition</InfoLabel>
          <InfoValue data-testid="listing-condition">{capitalize(condition)}</InfoValue>
        </InfoItem>
      )}
      {year && (
        <InfoItem>
          <InfoLabel>Year</InfoLabel>
          <InfoValue data-testid="listing-year">{year}</InfoValue>
        </InfoItem>
      )}
      {label && (
        <InfoItem>
          <InfoLabel>Label</InfoLabel>
          <InfoValue data-testid="listing-label">{capitalize(label)}</InfoValue>
        </InfoItem>
      )}
      {genres && genres.length > 0 && (
        <FullRowInfoItem>
          <InfoLabel>Genre{genres.length > 1 ? 's' : ''}</InfoLabel>
          <GenreList data-testid="listing-genres">
            {genres.map((genre) => (
              <GenreTag key={genre.id}>{genre.name}</GenreTag>
            ))}
          </GenreList>
        </FullRowInfoItem>
      )}
    </InfoGrid>
  );
}

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  box-sizing: border-box;
  width: fit-content;

  @media (min-width: ${breakpoint.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }

  @media (max-width: ${breakpoint.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xs']};
`;

const FullRowInfoItem = styled(InfoItem)`
  @media (min-width: ${breakpoint.md}) {
    grid-column: 1 / -1;
  }
`;

const InfoLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const GenreTag = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing['2xs']} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.background.elevated};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;
