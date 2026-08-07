import { useState } from 'react';
import { PiMagnifyingGlass, PiX } from 'react-icons/pi';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

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

  const handleSearchChange = (value: string) => {
    if (!isHomePage) {
      return;
    }
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
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
    setSearchParams({});
    if (!isHomePage) {
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
        <PiMagnifyingGlass />
      </SearchIconWrapper>
      {inputValue && (
        <ClearButton onClick={handleClear} aria-label="Clear search" data-testid="clear-search-button">
          <PiX />
        </ClearButton>
      )}
    </SearchWrapper>
  );
}

const SearchContainer = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  font-size: 1rem;
  background-color: #fff;
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
  color: ${(props) => props.theme.text.secondary};
  display: flex;
  align-items: center;
  font-size: 1.25rem;
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
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.background.secondary};
  }
`;
