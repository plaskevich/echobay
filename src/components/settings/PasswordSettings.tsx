import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/common/Button';
import { ButtonGroup, FieldError, FieldWrapper } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { supabase } from '@/lib/supabase';

import { Container, Description, Form, Message, SectionTitle } from './styles';

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PasswordFormData>({
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = async (data: PasswordFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: data.newPassword });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        toast.success('Password updated successfully.');
        setMessage(null);
        reset();
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container data-testid="password-settings">
      <SectionTitle>Change Password</SectionTitle>
      <Description>Choose a strong password to keep your account secure</Description>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper>
          <Input
            label="New Password"
            type="password"
            $hasError={!!errors.newPassword}
            {...register('newPassword', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            placeholder="Enter new password"
            autoComplete="new-password"
          />
          {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
        </FieldWrapper>

        <FieldWrapper>
          <Input
            label="Confirm New Password"
            type="password"
            $hasError={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value, { newPassword }) => value === newPassword || 'Passwords do not match',
            })}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
        </FieldWrapper>

        {message && <Message $type={message.type}>{message.text}</Message>}

        <ButtonGroup>
          <Button type="submit" disabled={!isValid} isLoading={isSaving}>
            Save
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}
