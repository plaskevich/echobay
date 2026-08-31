import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/StateDisplay';

interface ErrorPageProps {
  notFound?: boolean;
  title?: string;
  message?: string;
  'data-testid'?: string;
}

export function ErrorPage({ notFound = false, title, message, ...rest }: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <Container {...rest}>
      <EmptyState
        icon={<i className="hn hn-exclamation-triangle" aria-hidden />}
        title={title ?? (notFound ? 'Page not found' : 'Something went wrong')}
        message={
          message ??
          (notFound
            ? "The page you're looking for doesn't exist or has been moved."
            : 'An unexpected error occurred. Try again, or head back home.')
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

export function RouteError() {
  const error = useRouteError();
  const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  return <ErrorPage data-testid="route-error" notFound={notFound} />;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;
