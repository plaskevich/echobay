import { IoClose } from 'react-icons/io5';
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
    <SearchResults>
      <ResultsHeader>
        <ResultsTitle>Select a release to auto-fill the form:</ResultsTitle>
        <CloseResultsButton type="button" onClick={onClose}>
          <IoClose /> Close
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
  margin-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.border.primary};
  padding-top: 1rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const ResultsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;

const CloseResultsButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text.secondary};
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;

  &:hover {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.background.tertiary};
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
`;
