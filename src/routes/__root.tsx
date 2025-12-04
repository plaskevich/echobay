import styled from 'styled-components';

import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.text};
`;

export const Route = createRootRoute({
  component: () => (
    <AppWrapper>
      <Outlet />
      <TanStackRouterDevtools />
    </AppWrapper>
  ),
});
