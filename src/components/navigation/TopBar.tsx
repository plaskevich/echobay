import {
  PiBasketBold,
  PiChatCircleDuotone,
  PiGearBold,
  PiHeartDuotone,
  PiPlusCircleBold,
  PiSignOutBold,
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
import { Logo } from '@/components/common/Logo';
import { SearchBar } from '@/components/navigation/SearchBar';
import { useUnreadChats } from '@/queries/useMessages';
import { useProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

export function TopBar() {
  const { user } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const { data: profile } = useProfile(user?.id);
  const { data: unreadChats } = useUnreadChats();
  const location = useLocation();
  const navigate = useNavigate();
  const { themeColors } = useThemeStore();

  const hasUnread = unreadChats ? unreadChats.size > 0 : false;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <NavContent>
          <LogoLink to="/" onClick={() => location.pathname === '/'}>
            <Logo color={themeColors.text.muted} height={40} style={{ display: 'block' }} />
          </LogoLink>
          <SearchWrapper>
            <SearchBar />
          </SearchWrapper>

          <RightSection>
            {user ? (
              <>
                <Link to="/favorites">
                  <IconButton aria-label="Favorites">
                    <PiHeartDuotone />
                  </IconButton>
                </Link>
                <Link to="/messages">
                  <IconButtonWrapper>
                    <IconButton aria-label="Messages">
                      <PiChatCircleDuotone />
                    </IconButton>
                    {hasUnread && <NavUnreadDot />}
                  </IconButtonWrapper>
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
                  <MobileSellLink to="/items/new">
                    <PiPlusCircleBold /> Sell an Item
                  </MobileSellLink>
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
                  <DropdownMenuButton variant="danger" onClick={handleLogout}>
                    <PiSignOutBold /> Log out
                  </DropdownMenuButton>
                </Dropdown>
                <DesktopSellButton>
                  <Link to="/items/new">
                    <Button variant="primary" size="small">
                      Sell
                    </Button>
                  </Link>
                </DesktopSellButton>
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
  padding: 0 0.75rem;

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
  height: 3.5rem;

  @media (min-width: 640px) {
    height: 4rem;
  }
`;

const LogoLink = styled(Link)`
  flex-shrink: 0;
  padding-top: 0.2rem;
  svg path {
    transition: fill 0.2s;
  }

  &:hover svg path {
    fill: ${(props) => props.theme.text.accent};
  }

  @media (max-width: 640px) {
    svg {
      height: 32px;
    }
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  display: none;

  @media (min-width: 768px) {
    display: block;
    margin: 0 2rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (min-width: 640px) {
    gap: 0.7rem;
  }
`;

const DesktopSellButton = styled.div`
  @media (max-width: 360px) {
    display: none;
  }
`;

const MobileSellLink = styled(DropdownMenuLink)`
  display: none;

  @media (max-width: 360px) {
    display: flex;
  }
`;

const IconButton = styled.button`
  padding: 0.5rem;
  color: ${(props) => props.theme.text.secondary};
  background: none;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: ${(props) => props.theme.borderRadius.full};
    object-fit: cover;
    display: block;
  }

  &:hover {
    color: ${(props) => props.theme.primary.main};
    background-color: ${(props) => props.theme.primary.light};
  }

  @media (max-width: 640px) {
    padding: 0.4rem;
    font-size: 1.35rem;

    img {
      width: 1.35rem;
      height: 1.35rem;
    }
  }
`;

const IconButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const NavUnreadDot = styled.span`
  position: absolute;
  top: 0.6rem;
  right: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  background-color: ${(props) => props.theme.state.error};
  pointer-events: none;

  @media (max-width: 640px) {
    top: 0.5rem;
    right: 0.4rem;
    width: 0.45rem;
    height: 0.45rem;
  }
`;
