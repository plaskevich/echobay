import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';
import { PageTitle } from '@/components/common/PageTitle';
import { useAuthForm } from '@/hooks/useAuthForm';

export function Auth() {
  const location = useLocation();

  useEffect(() => {
    if ((location.state as { passwordReset?: boolean })?.passwordReset) {
      toast.success('Password updated successfully. You can now log in.');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const { mode, serverError, isLoading, form, onSubmit, handleGoogleSignIn, toggleMode } = useAuthForm();

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</AuthTitle>
        <Subtitle>{mode === 'login' ? 'Log in to your EchoBay account' : 'Join EchoBay today'}</Subtitle>

        <AuthForm
          mode={mode}
          form={form}
          serverError={serverError}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onGoogleSignIn={handleGoogleSignIn}
        />

        <AuthToggle mode={mode} onToggle={toggleMode} />
      </AuthCard>
    </AuthContainer>
  );
}

const AuthContainer = styled.div`
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

const AuthCard = styled.div`
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

const AuthTitle = styled(PageTitle)`
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 640px) {
    margin-bottom: 1.5rem;
  }
`;
