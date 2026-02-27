import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { resetPassword } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { FieldError, FieldWrapper } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { PageTitle } from '@/components/common/PageTitle';

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
    <Container>
      <Card>
        <Title>Reset Password</Title>

        {isSubmitted ? (
          <SuccessContent>
            <Subtitle>Check your email</Subtitle>
            <Description>
              We sent a password reset link to <strong>{getValues('email')}</strong>. Click the link in the email to set
              a new password.
            </Description>
            <BackLink to="/auth">Back to Log In</BackLink>
          </SuccessContent>
        ) : (
          <>
            <Subtitle>
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </Subtitle>

            <Form onSubmit={handleSubmit(onSubmit)}>
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

              {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

              <Button type="submit" fullWidth isLoading={isLoading}>
                Send Reset Link
              </Button>
            </Form>

            <BackLink to="/auth">Back to Log In</BackLink>
          </>
        )}
      </Card>
    </Container>
  );
}

const Container = styled.div`
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

const Card = styled.div`
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

const Title = styled(PageTitle)`
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 640px) {
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.state.error}20;
  color: ${({ theme }) => theme.state.error};
  border: 1px solid ${({ theme }) => theme.state.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
`;

const SuccessContent = styled.div`
  text-align: center;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
