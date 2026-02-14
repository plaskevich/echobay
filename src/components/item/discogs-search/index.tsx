import styled from 'styled-components';

import { ErrorMessage } from '@/components/common/Message';
import { type DiscogsSearchResult } from '@/hooks/useDiscogsSearch';

import { SearchInputBar } from './SearchInputBar';
import { SearchResultsList } from './SearchResultsList';

interface DiscogsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: DiscogsSearchResult[];
  isSearching: boolean;
  searchError: string | null;
  showSearchResults: boolean;
  isDisabled?: boolean;
  onSearch: () => Promise<void>;
  onSelectRelease: (releaseId: number) => Promise<void>;
  onClear: () => void;
}

export function DiscogsSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  searchError,
  showSearchResults,
  isDisabled = false,
  onSearch,
  onSelectRelease,
  onClear,
}: DiscogsSearchProps) {
  return (
    <SearchSection>
      <SearchContainer>
        <SearchLabel>✨ Search Discogs to Auto-Fill</SearchLabel>
        <SearchInputBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          isDisabled={isDisabled}
          onSearch={onSearch}
          onClear={onClear}
        />
        {searchError && <ErrorMessage>{searchError}</ErrorMessage>}
      </SearchContainer>

      {showSearchResults && searchResults.length > 0 && (
        <SearchResultsList
          results={searchResults}
          onSelectRelease={onSelectRelease}
          onClose={onClear}
          isSearching={isSearching}
        />
      )}
    </SearchSection>
  );
}

const SearchSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: ${(props) => props.theme.borderRadius.lg};

  @media (max-width: 640px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SearchLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;
