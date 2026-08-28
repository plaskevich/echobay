import styled from 'styled-components';

import { type DiscogsSearchResult } from '@/hooks/useDiscogsSearch';

import { SearchResultItem } from './SearchResultItem';

interface SearchResultsListProps {
  results: DiscogsSearchResult[];
  onSelectRelease: (releaseId: number) => Promise<void>;
  onClose: () => void;
  isSearching: boolean;
}

export function SearchResultsList({ results, onSelectRelease, onClose, isSearching }: SearchResultsListProps) {
  return (
    <SearchResults data-testid="discogs-results">
      <ResultsHeader>
        <ResultsTitle>Select a release to auto-fill the form:</ResultsTitle>
        <CloseResultsButton type="button" onClick={onClose}>
          <i className="hn hn-times" aria-hidden /> Close
        </CloseResultsButton>
      </ResultsHeader>
      <ResultsList>
        {results.map((result) => (
          <SearchResultItem key={result.id} result={result} onSelect={onSelectRelease} isDisabled={isSearching} />
        ))}
      </ResultsList>
    </SearchResults>
  );
}

const SearchResults = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.border.primary};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ResultsTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;

const CloseResultsButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text.secondary};
  padding: ${({ theme }) => theme.spacing['2xs']} ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2xs']};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.background.tertiary};
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-height: 400px;
  overflow-y: auto;
`;
