import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';
import { useThemeStore } from '@/store/theme-store';

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
export function App() {
  const themeColors = useThemeStore((state) => state.themeColors);

  return (
    <StyledThemeProvider theme={themeColors}>
      <RouterProvider router={router} />
    </StyledThemeProvider>
  );
}
