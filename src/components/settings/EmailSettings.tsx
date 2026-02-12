import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/auth-store';

import { ButtonRow, Container, Description, Form, Message, SectionTitle } from './styles';

export default function EmailSettings() {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasChanges = email !== (user?.email ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // TODO: integrate with Supabase auth.updateUser({ email })
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'A confirmation link has been sent to your new email address.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update email. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <SectionTitle>Change Email Address</SectionTitle>
      <Description>Update the email address associated with your account</Description>

      <Form onSubmit={handleSave}>
        <Input label="Current Email" type="email" value={user?.email ?? ''} disabled />
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
      </Form>
    </Container>
  );
}
