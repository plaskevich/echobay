import styled from 'styled-components';

interface ListingDescriptionProps {
  description?: string | null;
}

export function ListingDescription({ description }: ListingDescriptionProps) {
  if (!description) return null;

  return (
    <DescriptionSection>
      <SectionTitle>Description</SectionTitle>
      <Description data-testid="listing-description">{description}</Description>
    </DescriptionSection>
  );
}

const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;
