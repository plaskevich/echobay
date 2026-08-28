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
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;
