import { Navigate, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
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
