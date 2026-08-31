import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/common/Button';
import { ButtonGroup } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { InfoMessage } from '@/components/common/Message';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

import { Container, Description, Form, Message, SectionTitle } from './styles';

interface EmailFormData {
  email: string;
}

export default function EmailSettings() {
  const { user } = useAuthStore();
  const { register, handleSubmit, watch } = useForm<EmailFormData>({
    defaultValues: { email: '' },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isOAuthUser = user?.app_metadata?.provider !== 'email';
  const email = watch('email');
  const hasChanges = email.trim() !== '' && email !== (user?.email ?? '');

  const onSubmit = async (data: EmailFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ email: data.email });
      if (error) throw error;
      toast.success('A confirmation link has been sent to your new email address.');
      setMessage(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update email. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container data-testid="email-settings">
      <SectionTitle>Change Email Address</SectionTitle>
      <Description>Update the email address associated with your account</Description>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Current Email" type="email" value={user?.email ?? ''} disabled />

        {isOAuthUser ? (
          <InfoMessage>
            Your email is managed by your Google account. To change it, update your email in Google and sign in again.
          </InfoMessage>
        ) : (
          <>
            <Input
              label="New Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter new email address"
            />

            {message && <Message $type={message.type}>{message.text}</Message>}

            <ButtonGroup>
              <Button type="submit" disabled={!hasChanges} isLoading={isSaving}>
                Save
              </Button>
            </ButtonGroup>
          </>
        )}
      </Form>
    </Container>
  );
}
