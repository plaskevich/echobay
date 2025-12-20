import { type KeyboardEvent } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
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
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
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
        onKeyPress={handleKeyPress}
        placeholder="Search for artist, album, or record..."
        disabled={isSearching || isDisabled}
      />
      {searchQuery && (
        <ClearButton type="button" onClick={onClear} disabled={isSearching} aria-label="Clear search">
          <IoClose />
        </ClearButton>
      )}
      <SearchButton type="button" onClick={onSearch} disabled={isSearching || !searchQuery.trim() || isDisabled}>
        <>
          <IoSearch size={18} />
        </>
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
  border-radius: 0.75rem;
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary.light};
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
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;

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
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.primary.main};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.primary.hover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
