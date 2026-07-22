import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { resetPassword } from '@/api/auth';
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

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: '' },
  });
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('');
    setIsLoading(true);
    const { error } = await resetPassword(data.email);
    setIsLoading(false);

    if (error) {
      setServerError(error.message);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthCardTitle>Reset Password</AuthCardTitle>

        {isSubmitted ? (
          <SuccessContent>
            <AuthSubtitle>Check your email</AuthSubtitle>
            <Description>
              We sent a password reset link to <strong>{getValues('email')}</strong>. Click the link in the email to set
              a new password.
            </Description>
            <BackLink to="/auth">Back to Log In</BackLink>
          </SuccessContent>
        ) : (
          <>
            <AuthSubtitle>
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </AuthSubtitle>

            <AuthFormLayout onSubmit={handleSubmit(onSubmit)}>
              <FieldWrapper>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  $hasError={!!errors.email}
                  {...register('email', { required: 'Please enter your email address' })}
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </FieldWrapper>

              {serverError && <AuthErrorMessage>{serverError}</AuthErrorMessage>}

              <Button type="submit" fullWidth isLoading={isLoading}>
                Send Reset Link
              </Button>
            </AuthFormLayout>

            <BackLink to="/auth">Back to Log In</BackLink>
          </>
        )}
      </AuthCard>
    </AuthContainer>
  );
}

const SuccessContent = styled.div`
  text-align: center;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.primary.main};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
