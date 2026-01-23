import styled from 'styled-components';

import { FORMAT_OPTIONS } from '@/lib/constants/listings';
import { capitalize } from '@/lib/utils';

interface ListingInfoProps {
  format?: string;
  condition?: string;
  genre?: string;
  label?: string;
}

export function ListingInfo({ format, condition, genre, label }: ListingInfoProps) {
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
      {genre && (
        <InfoItem>
          <InfoLabel>Genre</InfoLabel>
          <InfoValue>{capitalize(genre)}</InfoValue>
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
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  box-sizing: border-box;
  width: 100%;
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
