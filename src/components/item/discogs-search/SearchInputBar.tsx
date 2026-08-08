import { type KeyboardEvent } from 'react';
import styled from 'styled-components';

interface SearchInputBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  isDisabled: boolean;
  onSearch: () => Promise<void>;
  onClear: () => void;
}

export function SearchInputBar({
  searchQuery,
  setSearchQuery,
  isSearching,
  isDisabled,
  onSearch,
  onClear,
}: SearchInputBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <SearchInputGroup>
      <SearchInput
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for artist, album, or record..."
        disabled={isSearching || isDisabled}
        data-testid="discogs-search-input"
      />
      {searchQuery && (
        <ClearButton type="button" onClick={onClear} disabled={isSearching} aria-label="Clear search">
          <i className="hn hn-times" />
        </ClearButton>
      )}
      <SearchButton
        type="button"
        onClick={onSearch}
        disabled={isSearching || !searchQuery.trim() || isDisabled}
        data-testid="discogs-search-button"
      >
        <i className="hn hn-search" />
      </SearchButton>
    </SearchInputGroup>
  );
}

const SearchInputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.border.hover};
  }

  &::placeholder {
    color: ${(props) => props.theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 65px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.text.secondary};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.background.secondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  color: #000;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: background-color ${(props) => props.theme.transition.base};
  background-color: transparent;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.primary.main};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
