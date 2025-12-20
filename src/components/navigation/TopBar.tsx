import { IoHeartOutline, IoMoonOutline, IoPersonOutline, IoSearch, IoSunnyOutline } from 'react-icons/io5';
import styled from 'styled-components';

import { Link } from '@tanstack/react-router';

import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

const Nav = styled.nav`
  background-color: ${(props) => props.theme.background.primary};
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.primary.main};
`;

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
  border-radius: 0.5rem;
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  color: ${(props) => props.theme.text.secondary};
  background: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  &:hover {
    color: ${(props) => props.theme.primary.main};
    background-color: ${(props) => props.theme.primary.light};
  }
`;
export function TopBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <Nav>
      <NavContainer>
        <NavContent>
          <LogoLink to="/">
            <Logo>EchoBay</Logo>
          </LogoLink>
          <SearchContainer>
            <SearchWrapper>
              <SearchInput type="text" placeholder="Search for items..." />
              <SearchIconWrapper>
                <IoSearch />
              </SearchIconWrapper>
            </SearchWrapper>
          </SearchContainer>

          <RightSection>
            <IconButton onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <IoMoonOutline /> : <IoSunnyOutline />}
            </IconButton>
            {user ? (
              <>
                <Link to="/favorites">
                  <IconButton aria-label="Favorites">
                    <IoHeartOutline />
                  </IconButton>
                </Link>
                <Link to="/profile">
                  <IconButton aria-label="Profile">
                    <IoPersonOutline />
                  </IconButton>
                </Link>
                <Link to="/items/new">
                  <Button variant="primary" size="small">
                    Sell
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="small">
                  Sign In
                </Button>
              </Link>
            )}
          </RightSection>
        </NavContent>
      </NavContainer>
    </Nav>
  );
}
