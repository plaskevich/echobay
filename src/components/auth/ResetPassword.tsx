import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { updatePassword } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { PageTitle } from '@/components/common/PageTitle';
import { useAuthStore } from '@/store/auth-store';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isRecoveryMode, isInitialized, clearRecoveryMode } = useAuthStore();

  useEffect(() => {
    return () => clearRecoveryMode();
  }, [clearRecoveryMode]);

  if (isInitialized && !isRecoveryMode) {
    return <Navigate to="/auth/forgot-password" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(password);
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      clearRecoveryMode();
      navigate('/auth', {
        replace: true,
        state: { passwordReset: true },
      });
    }
  };

  return (
    <Container>
      <Card>
        <Title>Set New Password</Title>
        <Subtitle>Enter your new password below.</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Update Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 640px) {
    padding: 1rem 0;
    align-items: flex-start;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px ${({ theme }) => theme.shadow.medium};

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
`;

const Title = styled(PageTitle)`
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 640px) {
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.state.error}20;
  color: ${({ theme }) => theme.state.error};
  border: 1px solid ${({ theme }) => theme.state.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
`;
