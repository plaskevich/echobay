import styled from 'styled-components';

import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';
import { useAuthForm } from '@/hooks/useAuthForm';

export function Auth() {
  const {
    mode,
    email,
    password,
    confirmPassword,
    error,
    success,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    handleGoogleSignIn,
    toggleMode,
  } = useAuthForm();

  return (
    <AuthContainer>
      <AuthCard>
        <Title>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</Title>
        <Subtitle>{mode === 'login' ? 'Log in to your EchoBay account' : 'Join EchoBay today'}</Subtitle>

        <AuthForm
          mode={mode}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          error={error}
          success={success}
          isLoading={isLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
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
`;

const AuthCard = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 1.25rem;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px ${({ theme }) => theme.shadow.medium};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
`;
