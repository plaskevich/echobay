import styled from 'styled-components';

import { type DiscogsSearchResult } from '@/hooks/useDiscogsSearch';
import { ellipsis } from '@/lib/theme/mixins';

interface SearchResultItemProps {
  result: DiscogsSearchResult;
  onSelect: (releaseId: number) => Promise<void>;
  isDisabled: boolean;
}

export function SearchResultItem({ result, onSelect, isDisabled }: SearchResultItemProps) {
  return (
    <ResultItem onClick={() => onSelect(result.id)} disabled={isDisabled} data-testid={`discogs-result-${result.id}`}>
      {result.thumb && <ResultImage src={result.thumb} alt={result.title} loading="lazy" />}
      <ResultInfo>
        <ResultTitle>{result.title}</ResultTitle>
        <ResultMeta>
          {result.year && <span>{result.year}</span>}
          {result.label && result.label.length > 0 && <span>{result.label[0]}</span>}
          {result.genre && result.genre.length > 0 && <span>{result.genre[0]}</span>}
        </ResultMeta>
      </ResultInfo>
    </ResultItem>
  );
}

const ResultItem = styled.button`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  text-align: left;
  transition: all ${(props) => props.theme.transition.base};

  &:hover:not(:disabled) {
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: ${(props) => props.theme.shadow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ResultInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xs']};
  min-width: 0;
`;

const ResultTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${(props) => props.theme.text.primary};
  ${ellipsis}
`;

const ResultMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${(props) => props.theme.text.secondary};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;

  span {
    &:not(:last-child)::after {
      content: '•';
      margin-left: ${({ theme }) => theme.spacing.xs};
      color: ${(props) => props.theme.text.tertiary};
    }
  }
`;
