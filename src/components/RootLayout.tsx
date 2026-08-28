import { Outlet, ScrollRestoration } from 'react-router-dom';
import styled from 'styled-components';

import { AuthDialog } from '@/components/auth/AuthDialog';
import { CONTENT_MAX_WIDTH } from '@/components/layout/viewport';
import { TopBar } from '@/components/navigation/TopBar';
import { breakpoint } from '@/lib/theme/breakpoints';

const AppWrapper = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
  overflow-x: clip;
`;

const MainContent = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${breakpoint.md}) {
    padding: 0;
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
`;

export function RootLayout() {
  return (
    <AppWrapper>
      <ScrollRestoration />
      <TopBar />
      <MainContent>
        <Outlet />
      </MainContent>
      <AuthDialog />
    </AppWrapper>
  );
}
