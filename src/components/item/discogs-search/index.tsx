import styled from 'styled-components';

import { ErrorMessage } from '@/components/common/Message';
import { type DiscogsSearchResult } from '@/hooks/useDiscogsSearch';
import { breakpoint } from '@/lib/theme/breakpoints';

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
        <SearchLabel>Search Discogs to Auto-Fill</SearchLabel>
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
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.border.primary};

  @media (max-width: ${breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SearchLabel = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;
