import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

import {
  AuthCard,
  AuthCardTitle,
  AuthContainer,
  AuthErrorMessage,
  AuthFormLayout,
  AuthSubtitle,
} from '@/components/auth/authLayout';
import { Button } from '@/components/common/Button';
import { FieldError, FieldWrapper } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', confirmPassword: '' },
  });
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isRecoveryMode, isInitialized, clearRecoveryMode, openAuthDialog } = useAuthStore();

  const isExpired = isInitialized && !isRecoveryMode;

  useEffect(() => {
    return () => clearRecoveryMode();
  }, [clearRecoveryMode]);

  useEffect(() => {
    if (isExpired) openAuthDialog('forgot');
  }, [isExpired, openAuthDialog]);

  if (isExpired) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError('');
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: data.password });
    setIsLoading(false);

    if (error) {
      setServerError(error.message);
    } else {
      clearRecoveryMode();
      toast.success('Password updated successfully. You can now log in.');
      navigate('/', { replace: true });
      openAuthDialog('login');
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthCardTitle>Set New Password</AuthCardTitle>
        <AuthSubtitle>Enter your new password below.</AuthSubtitle>

        <AuthFormLayout onSubmit={handleSubmit(onSubmit)}>
          <FieldWrapper>
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              $hasError={!!errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </FieldWrapper>

          <FieldWrapper>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              $hasError={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value, { password }) => value === password || 'Passwords do not match',
              })}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
          </FieldWrapper>

          {serverError && <AuthErrorMessage>{serverError}</AuthErrorMessage>}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Update Password
          </Button>
        </AuthFormLayout>
      </AuthCard>
    </AuthContainer>
  );
}
