import styled from 'styled-components';

import { FORMAT_OPTIONS } from '@/lib/constants/listings';
import { capitalize } from '@/lib/utils';

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
}

export function ListingInfo({ format, condition, genres, label }: ListingInfoProps) {
  const getFormatLabel = (value: string) => {
    const option = FORMAT_OPTIONS.find((opt) => opt.value === value);
    return option?.label || capitalize(value);
  };

  return (
    <InfoGrid>
      {format && (
        <InfoItem>
          <InfoLabel>Format</InfoLabel>
          <InfoValue>{getFormatLabel(format)}</InfoValue>
        </InfoItem>
      )}
      {condition && (
        <InfoItem>
          <InfoLabel>Condition</InfoLabel>
          <InfoValue>{capitalize(condition)}</InfoValue>
        </InfoItem>
      )}
      {genres && genres.length > 0 && (
        <InfoItem>
          <InfoLabel>Genre{genres.length > 1 ? 's' : ''}</InfoLabel>
          <GenreList>
            {genres.map((genre) => (
              <GenreTag key={genre.id}>{genre.name}</GenreTag>
            ))}
          </GenreList>
        </InfoItem>
      )}
      {label && (
        <InfoItem>
          <InfoLabel>Label</InfoLabel>
          <InfoValue>{capitalize(label)}</InfoValue>
        </InfoItem>
      )}
    </InfoGrid>
  );
}

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.border.primary};
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
  background-color: ${({ theme }) => theme.primary.light};
  color: ${({ theme }) => theme.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.border.primary};
  font-size: 0.875rem;
  font-weight: 500;
`;
