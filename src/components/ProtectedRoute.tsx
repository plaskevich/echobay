import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { LoadingState } from '@/components/common/StateDisplay';
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
        <LoadingState />
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
