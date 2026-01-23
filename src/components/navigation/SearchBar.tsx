import { PiMagnifyingGlass } from 'react-icons/pi';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';

  const handleSearchChange = (value: string) => {
    if (location.pathname !== '/') {
      return;
    }
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const query = target.value.trim();

      if (location.pathname !== '/') {
        navigate(query ? `/?q=${encodeURIComponent(query)}` : '/');
      } else {
        handleSearchChange(query);
      }
    }
  };

  return (
    <SearchContainer>
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Search for items..."
          defaultValue={searchQuery}
          key={searchQuery}
          onKeyDown={handleKeyDown}
        />
        <SearchIconWrapper>
          <PiMagnifyingGlass />
        </SearchIconWrapper>
      </SearchWrapper>
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  flex: 1;
  max-width: 42rem;
  margin: 0 2rem;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
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
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.text.tertiary};
  display: flex;
  align-items: center;
  font-size: 1.25rem;
`;
