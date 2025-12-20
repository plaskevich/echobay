import styled from 'styled-components';

import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TopBar } from '@/components/navigation/TopBar';

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Route = createRootRoute({
  component: () => (
    <AppWrapper>
      <TopBar />
      <MainContent>
        <Outlet />
      </MainContent>
      <TanStackRouterDevtools />
    </AppWrapper>
  ),
});
