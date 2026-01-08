import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  success: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

export function AuthForm({
  mode,
  email,
  password,
  confirmPassword,
  error,
  success,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onGoogleSignIn,
}: AuthFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      <GoogleButton type="button" onClick={onGoogleSignIn} disabled={isLoading}>
        <FcGoogle size={20} />
        Continue with Google
      </GoogleButton>

      <Divider>
        <DividerLine />
        <DividerText>or</DividerText>
        <DividerLine />
      </Divider>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        disabled={isLoading}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
      />

      {mode === 'signup' && (
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Button type="submit" fullWidth isLoading={isLoading}>
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </Button>
    </Form>
  );
}

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
  border-radius: 0.75rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.state.success}20;
  color: ${({ theme }) => theme.state.success};
  border: 1px solid ${({ theme }) => theme.state.success};
  border-radius: 0.75rem;
  font-size: 0.875rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.border.hover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.border.primary};
`;

const DividerText = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
`;
