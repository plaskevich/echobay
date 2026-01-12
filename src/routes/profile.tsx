import styled from 'styled-components';

import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
`;
