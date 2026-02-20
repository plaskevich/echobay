import { useState } from 'react';
import toast from 'react-hot-toast';

import { updatePassword } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

import { ButtonRow, Container, Description, Form, Message, SectionTitle } from './styles';

export default function PasswordSettings() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isValid = newPassword.length >= 6 && confirmPassword && newPassword === confirmPassword;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await updatePassword(newPassword);

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        toast.success('Password updated successfully.');
        setMessage(null);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
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
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
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
