import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

import { ButtonRow, Container, Description, Form, Message, SectionTitle } from './styles';

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isValid = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // TODO: integrate with Supabase auth.updateUser({ password })
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <SectionTitle>Change Password</SectionTitle>
      <Description>Choose a strong password to keep your account secure</Description>

      <Form onSubmit={handleSave}>
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />

        {message && <Message $type={message.type}>{message.text}</Message>}

        <ButtonRow>
          <Button type="submit" disabled={!isValid} isLoading={isSaving}>
            Save
          </Button>
        </ButtonRow>
      </Form>
    </Container>
  );
}
