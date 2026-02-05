import {
  PiBasketBold,
  PiGearBold,
  PiHeartDuotone,
  PiMoonDuotone,
  PiSignOutBold,
  PiSunDuotone,
  PiUserBold,
  PiUserCircleDuotone,
} from 'react-icons/pi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import {
  Dropdown,
  DropdownMenuButton,
  DropdownMenuLink,
  DropdownMenuSeparator,
} from '@/components/common/DropdownMenu';
import { SearchBar } from '@/components/navigation/SearchBar';
import { useProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

export function TopBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const { data: profile } = useProfile(user?.id);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <NavContent>
          <LogoLink to="/" onClick={() => location.pathname === '/'}>
            <Logo>EchoBay</Logo>
          </LogoLink>
          <SearchBar />

          <RightSection>
            <IconButton onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <PiMoonDuotone /> : <PiSunDuotone />}
            </IconButton>
            {user ? (
              <>
                <Link to="/favorites">
                  <IconButton aria-label="Favorites">
                    <PiHeartDuotone />
                  </IconButton>
                </Link>
                <Dropdown
                  menuLabel="Profile options"
                  trigger={({ onClick, ...triggerProps }) => (
                    <IconButton type="button" aria-label="Profile menu" onClick={onClick} {...triggerProps}>
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" referrerPolicy="no-referrer" />
                      ) : (
                        <PiUserCircleDuotone />
                      )}
                    </IconButton>
                  )}
                >
                  <DropdownMenuLink to="/profile">
                    <PiUserBold /> Profile
                  </DropdownMenuLink>
                  <DropdownMenuLink to="/orders">
                    <PiBasketBold />
                    Orders
                  </DropdownMenuLink>
                  <DropdownMenuLink to="/settings">
                    <PiGearBold /> Settings
                  </DropdownMenuLink>
                  <DropdownMenuSeparator />
                  <DropdownMenuButton onClick={handleLogout}>
                    <PiSignOutBold /> Log out
                  </DropdownMenuButton>
                </Dropdown>
                <Link to="/items/new">
                  <Button variant="primary" size="small">
                    Sell
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="small">
                  Log in | Sign up
                </Button>
              </Link>
            )}
          </RightSection>
        </NavContent>
      </NavContainer>
    </Nav>
  );
}

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
  color: ${(props) => props.theme.text.secondary};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  color: ${(props) => props.theme.text.secondary};
  background: none;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    object-fit: cover;
    display: block;
  }

  &:hover {
    color: ${(props) => props.theme.primary.main};
    background-color: ${(props) => props.theme.primary.light};
  }
`;
