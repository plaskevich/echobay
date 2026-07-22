import { Outlet, ScrollRestoration } from 'react-router-dom';
import styled from 'styled-components';

import { TopBar } from '@/components/navigation/TopBar';

const AppWrapper = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
`;

const MainContent = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
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
    </AppWrapper>
  );
}
