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
}: AuthFormProps) {
  return (
    <Form onSubmit={onSubmit}>
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
  gap: 1.5rem;
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
