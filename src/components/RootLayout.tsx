import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { TopBar } from '@/components/navigation/TopBar';

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text};

  @media (max-width: 768px) {
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0;
    min-height: 0;
    overflow-y: auto;
  }
`;

export function RootLayout() {
  return (
    <AppWrapper>
      <TopBar />
      <MainContent>
        <Outlet />
      </MainContent>
    </AppWrapper>
  );
}
