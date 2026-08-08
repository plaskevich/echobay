import styled from 'styled-components';

import { capitalize, getFormatLabel } from '@/lib/utils';

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface ListingInfoProps {
  format?: string;
  condition?: string;
  genres?: Genre[];
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
  gap: 0.5rem;
  box-sizing: border-box;
  width: fit-content;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FullRowInfoItem = styled(InfoItem)`
  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const GenreTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.background.elevated};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  font-size: 0.875rem;
  font-weight: 500;
`;
