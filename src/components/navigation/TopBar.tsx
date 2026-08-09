import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import {
  Dropdown,
  DropdownMenuButton,
  DropdownMenuLink,
  DropdownMenuSeparator,
} from '@/components/common/DropdownMenu';
import { Logo } from '@/components/navigation/Logo';
import { SearchBar } from '@/components/navigation/SearchBar';
import { useUnreadChats } from '@/queries/useMessages';
import { useAuthStore } from '@/store/auth-store';

export function TopBar() {
  const { user } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const openAuthDialog = useAuthStore((state) => state.openAuthDialog);
  const { data: unreadChats } = useUnreadChats();
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
          <Logo />
          <SearchWrapper>
            <SearchBar />
          </SearchWrapper>

          <RightSection>
            {user ? (
              <>
                <Link to="/items/new">
                  <SellButton variant="primary" size="small">
                    Sell
                  </SellButton>
                </Link>
                <Link to="/messages">
                  <IconButtonWrapper>
                    <IconButton aria-label="Messages" style={{ marginTop: '0.25rem', fontSize: '1.32rem' }}>
                      <i className="hn hn-message" />
                    </IconButton>
                    {hasUnread && <NavUnreadDot />}
                  </IconButtonWrapper>
                </Link>
                <Link to="/favorites">
                  <IconButton aria-label="Favorites">
                    <i className="hn hn-heart" />
                  </IconButton>
                </Link>

                <Dropdown
                  menuLabel="Profile options"
                  trigger={({ onClick, ...triggerProps }) => (
                    <IconButton type="button" aria-label="Profile menu" onClick={onClick} {...triggerProps}>
                      <i className="hn hn-user" />
                    </IconButton>
                  )}
                >
                  <DropdownMenuLink to="/profile">
                    <i className="hn hn-user-solid" /> Profile
                  </DropdownMenuLink>
                  <DropdownMenuLink to="/orders">
                    <i className="hn hn-receipt-solid" />
                    Orders
                  </DropdownMenuLink>
                  <DropdownMenuLink to="/settings">
                    <i className="hn hn-cog-solid" /> Settings
                  </DropdownMenuLink>
                  <DropdownMenuSeparator />
                  <DropdownMenuButton variant="danger" onClick={handleLogout}>
                    <i className="hn hn-logout-solid" /> Log out
                  </DropdownMenuButton>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => openAuthDialog('signup')}
                  data-testid="open-auth-signup"
                >
                  Sign up
                </Button>
                <Button variant="primary" size="small" onClick={() => openAuthDialog('login')} data-testid="open-auth">
                  Log in
                </Button>
              </>
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
  height: 4rem;

  @media (min-width: 640px) {
    height: 5rem;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  display: none;

  @media (min-width: 768px) {
    display: block;
    margin: 0 4rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 640px) {
    gap: 1rem;
  }
`;

const SellButton = styled(Button)`
  @media (max-width: 640px) {
    padding: 0.75rem;
  }
`;

const IconButton = styled.button`
  color: ${(props) => props.theme.text.primary};
  background: none;
  border: none;
  transition: all ${(props) => props.theme.transition.base};
  display: flex;
  align-items: center;
  font-size: 1.4rem;

  img {
    width: 1.75rem;
    height: 1.75rem;
    object-fit: cover;
    display: block;
    border-radius: 50%;
  }

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.primary.main};
    }
  }

  &:active {
    color: ${(props) => props.theme.primary.main};
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
  top: 0.2rem;
  right: 0.2rem;
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${(props) => props.theme.state.error};
  pointer-events: none;
  border-radius: 50%;

  @media (max-width: 640px) {
    top: 0.5rem;
    right: 0.4rem;
    width: 0.45rem;
    height: 0.45rem;
  }
`;
