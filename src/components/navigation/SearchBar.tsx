import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const isHomePage = location.pathname === '/';

  return (
    <SearchContainer>
      <SearchInputField
        key={`${location.pathname}:${searchQuery}`}
        isHomePage={isHomePage}
        searchQuery={searchQuery}
        setSearchParams={setSearchParams}
        navigate={navigate}
      />
    </SearchContainer>
  );
}

type SearchInputFieldProps = {
  isHomePage: boolean;
  searchQuery: string;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  navigate: ReturnType<typeof useNavigate>;
};

function SearchInputField({ isHomePage, searchQuery, setSearchParams, navigate }: SearchInputFieldProps) {
  const [inputValue, setInputValue] = useState(isHomePage ? searchQuery : '');

  const applyQuery = (query: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (query) {
        next.set('q', query);
      } else {
        next.delete('q');
      }
      next.set('page', '1');
      return next;
    });
  };

  const handleSearchChange = (value: string) => {
    if (!isHomePage) {
      return;
    }
    applyQuery(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    const query = inputValue.trim();

    if (!isHomePage) {
      navigate(query ? `/?q=${encodeURIComponent(query)}` : '/');
      return;
    }

    handleSearchChange(query);
  };

  const handleClear = () => {
    setInputValue('');
    if (isHomePage) {
      applyQuery('');
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <SearchWrapper>
      <SearchInput
        type="text"
        placeholder="Search for items..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        data-testid="search-input"
      />
      <SearchIconWrapper>
        <i className="hn hn-search" />
      </SearchIconWrapper>
      {inputValue && (
        <ClearButton onClick={handleClear} aria-label="Clear search" data-testid="clear-search-button">
          <i className="hn hn-times" />
        </ClearButton>
      )}
    </SearchWrapper>
  );
}

const SearchContainer = styled.div`
  flex: 1;

  @media (max-width: ${breakpoint.md}) {
    max-width: 100%;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} 2.5rem ${({ theme }) => theme.spacing.xs}
    ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${(props) => props.theme.border.primary};
  font-size: ${({ theme }) => theme.fontSize.base};
  background-color: ${(props) => props.theme.background.elevated};
  color: ${(props) => props.theme.text.primary};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.black.main};
  }

  &::placeholder {
    color: ${(props) => props.theme.text.secondary};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.text.tertiary};
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.text.tertiary};
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.xs};
  padding: ${({ theme }) => theme.spacing['2xs']};
  transition: all ${(props) => props.theme.transition.base};

  &:hover {
    color: ${(props) => props.theme.primary.main};
  }
`;
