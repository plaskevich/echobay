import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const openAuthDialog = useAuthStore((state) => state.openAuthDialog);
  const location = useLocation();

  const redirectTo = location.pathname + location.search;

  useEffect(() => {
    if (isInitialized && !user) openAuthDialog('login', redirectTo);
  }, [isInitialized, user, redirectTo, openAuthDialog]);

  if (!isInitialized) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1rem;
`;
