import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { resetPassword } from '@/api/auth';
import { AuthErrorMessage, AuthFormLayout, AuthSubtitle } from '@/components/auth/authLayout';
import { Button } from '@/components/common/Button';
import { FieldError, FieldWrapper } from '@/components/common/Form';
import { Input } from '@/components/common/Input';

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
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

  if (isSubmitted) {
    return (
      <SuccessContent>
        <AuthSubtitle>Check your email</AuthSubtitle>
        <Description>
          We sent a password reset link to <strong>{getValues('email')}</strong>. Click the link in the email to set a
          new password.
        </Description>
        <BackLink type="button" onClick={onBack}>
          Back to Log In
        </BackLink>
      </SuccessContent>
    );
  }

  return (
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

      <BackLink type="button" onClick={onBack}>
        Back to Log In
      </BackLink>
    </>
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

const BackLink = styled.button`
  display: block;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
  background: none;
  border: none;
  padding: 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.primary.main};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
