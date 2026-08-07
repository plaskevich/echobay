import { type UseFormReturn } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';

import { AuthErrorMessage, AuthFormLayout } from '@/components/auth/authLayout';
import { Button } from '@/components/common/Button';
import { FieldError, FieldWrapper } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { type AuthFormData } from '@/hooks/useAuthForm';

interface AuthFormProps {
  mode: 'login' | 'signup';
  form: UseFormReturn<AuthFormData>;
  serverError: string;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onGoogleSignIn: () => void;
  onForgotPassword: () => void;
}

export function AuthForm({
  mode,
  form,
  serverError,
  isLoading,
  onSubmit,
  onGoogleSignIn,
  onForgotPassword,
}: AuthFormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;
  const password = watch('password');

  return (
    <AuthFormLayout onSubmit={onSubmit}>
      <GoogleButton type="button" onClick={onGoogleSignIn} disabled={isLoading}>
        <FcGoogle size={20} />
        Continue with Google
      </GoogleButton>

      <Divider>
        <DividerLine />
        <DividerText>or</DividerText>
        <DividerLine />
      </Divider>

      <FieldWrapper>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          $hasError={!!errors.email}
          {...register('email', { required: 'Email is required' })}
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </FieldWrapper>

      <FieldWrapper>
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          $hasError={!!errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
          disabled={isLoading}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </FieldWrapper>

      {mode === 'login' && (
        <ForgotPasswordLink type="button" onClick={onForgotPassword}>
          Forgot password?
        </ForgotPasswordLink>
      )}

      {mode === 'signup' && (
        <FieldWrapper>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            $hasError={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
        </FieldWrapper>
      )}

      {serverError && <AuthErrorMessage>{serverError}</AuthErrorMessage>}

      <Button type="submit" fullWidth isLoading={isLoading} data-testid="auth-submit-button">
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </Button>
    </AuthFormLayout>
  );
}

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition:
    background-color ${({ theme }) => theme.transition.base},
    border-color ${({ theme }) => theme.transition.base};
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
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.border.primary};
`;

const DividerText = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ForgotPasswordLink = styled.button`
  align-self: center;
  margin-top: -${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  padding: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.primary.main};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
