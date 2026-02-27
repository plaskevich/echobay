import { useState } from 'react';
import toast from 'react-hot-toast';

import { updateEmail } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/auth-store';

import { ButtonRow, Container, Description, Form, Message, SectionTitle } from './styles';

export default function EmailSettings() {
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isOAuthUser = user?.app_metadata?.provider !== 'email';
  const hasChanges = email.trim() !== '' && email !== (user?.email ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await updateEmail(email);
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

      <Form onSubmit={handleSave}>
        <Input label="Current Email" type="email" value={user?.email ?? ''} disabled />

        {isOAuthUser ? (
          <Message $type="error">
            Your email is managed by your Google account. To change it, update your email in Google and sign in again.
          </Message>
        ) : (
          <>
            <Input
              label="New Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email address"
              required
            />

            {message && <Message $type={message.type}>{message.text}</Message>}

            <ButtonRow>
              <Button type="submit" disabled={!hasChanges} isLoading={isSaving}>
                Save
              </Button>
            </ButtonRow>
          </>
        )}
      </Form>
    </Container>
  );
}
