import { type UseFormReturn } from 'react-hook-form';
import styled from 'styled-components';

import googleIcon from '@/assets/google.svg';
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
        <img src={googleIcon} alt="" width={20} height={20} />
        Continue with Google
      </GoogleButton>

      <Divider />

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

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        data-testid="auth-submit-button"
        style={{ fontWeight: 700 }}
      >
        {mode === 'login' ? 'LOG IN' : 'SIGN UP'}
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
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  transition: border-color ${({ theme }) => theme.transition.base};
  width: 100%;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.border.hover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.hr`
  height: 1px;
  border: none;
  background-color: ${({ theme }) => theme.border.primary};
  /* full-bleed through the dialog's padding; falls back to flush when not in a dialog */
  margin: 1.2rem calc(-1 * var(--dialog-body-padding, 0px));
`;

const ForgotPasswordLink = styled.button`
  align-self: center;
  margin-top: -${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  padding: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
