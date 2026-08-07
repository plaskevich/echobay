import {
  PiBasketBold,
  PiChatCircleDuotone,
  PiGearBold,
  PiHeartDuotone,
  PiPlusCircleDuotone,
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
import { SearchBar } from '@/components/navigation/SearchBar';
import { glassSurface } from '@/lib/theme';
import { useUnreadChats } from '@/queries/useMessages';
import { useProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';

export function TopBar() {
  const { user } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const openAuthDialog = useAuthStore((state) => state.openAuthDialog);
  const { data: profile } = useProfile(user?.id);
  const { data: unreadChats } = useUnreadChats();
  const location = useLocation();
  const navigate = useNavigate();

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
            <LogoText>EchoBay</LogoText>
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
                <Link to="/items/new">
                  <SellButton variant="primary" size="small">
                    <PiPlusCircleDuotone size={14} />
                    Sell
                  </SellButton>
                </Link>
              </>
            ) : (
              <Button variant="primary" size="small" onClick={() => openAuthDialog()} data-testid="open-auth">
                Log in | Sign up
              </Button>
            )}
          </RightSection>
        </NavContent>
      </NavContainer>
    </Nav>
  );
}

const Nav = styled.nav`
  ${glassSurface}
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
  height: 4rem;

  @media (min-width: 640px) {
    height: 5rem;
  }
`;

const LogoLink = styled(Link)`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoText = styled.span`
  font-family: 'LEDLIGHT', 'Archivo Variable', system-ui, sans-serif;
  font-size: 2.2rem;
  line-height: 1;
  color: ${(props) => props.theme.text.muted};
  transition: color 0.2s;
  margin-top: 0.3rem;

  ${LogoLink}:hover & {
    color: ${(props) => props.theme.primary.main};
  }

  @media (max-width: 640px) {
    font-size: 2rem;
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

const SellButton = styled(Button)`
  @media (max-width: 640px) {
    padding: 0.75rem;
  }
`;

const IconButton = styled.button`
  padding: 0.5rem;
  color: ${(props) => props.theme.text.secondary};
  background: none;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: cover;
    display: block;
  }

  &:hover {
    color: ${(props) => props.theme.primary.main};
    background-color: ${(props) => props.theme.primary.light};
  }

  @media (max-width: 640px) {
    padding: 0.4rem;
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
  background-color: ${(props) => props.theme.state.error};
  pointer-events: none;

  @media (max-width: 640px) {
    top: 0.5rem;
    right: 0.4rem;
    width: 0.45rem;
    height: 0.45rem;
  }
`;
