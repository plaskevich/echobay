import { useState } from 'react';
import styled from 'styled-components';

import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/auth-store';

const AuthContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 1rem;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary.light};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.state.error}20;
  color: ${({ theme }) => theme.state.error};
  border: 1px solid ${({ theme }) => theme.state.error};
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.state.success}20;
  color: ${({ theme }) => theme.state.success};
  border: 1px solid ${({ theme }) => theme.state.success};
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const ToggleText = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

type AuthMode = 'signin' | 'signup';

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { signIn, signUp, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate({ to: '/' });
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</Title>
        <Subtitle>{mode === 'signin' ? 'Sign in to your EchoBay account' : 'Join EchoBay today'}</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </FormGroup>

          {mode === 'signup' && (
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </FormGroup>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </Form>

        <ToggleText>
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          <ToggleButton type="button" onClick={toggleMode}>
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </ToggleButton>
        </ToggleText>
      </AuthCard>
    </AuthContainer>
  );
}
