import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/StateDisplay';

export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <Container data-testid="route-error">
      <EmptyState
        icon={<i className={notFound ? 'hn hn-map-signs' : 'hn hn-exclamation-triangle'} aria-hidden />}
        title={notFound ? 'Page not found' : 'Something went wrong'}
        message={
          notFound
            ? "The page you're looking for doesn't exist or has been moved."
            : 'An unexpected error occurred. Try again, or head back home.'
        }
      />
      <Actions>
        {!notFound && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        )}
        <Button variant="primary" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Actions>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;
