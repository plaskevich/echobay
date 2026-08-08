import styled from 'styled-components';

import { type DiscogsSearchResult } from '@/hooks/useDiscogsSearch';

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
  gap: 1rem;
  padding: 0.75rem;
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
  gap: 0.25rem;
  min-width: 0;
`;

const ResultTitle = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ResultMeta = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  span {
    &:not(:last-child)::after {
      content: '•';
      margin-left: 0.5rem;
      color: ${(props) => props.theme.text.tertiary};
    }
  }
`;
