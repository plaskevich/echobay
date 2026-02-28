import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { useProfileEdit } from '@/hooks/useProfileEdit';

import { AvatarUpload } from './AvatarUpload';
import { FormHeader } from './FormHeader';
import { ProfileFormFields } from './ProfileFormFields';

export function ProfileEditForm() {
  const { form, loading, submitting, avatarPreview, handleAvatarChange, removeAvatar, handleSubmit, handleCancel } =
    useProfileEdit();

  if (loading) {
    return (
      <>
        <LoadingMessage>Loading profile...</LoadingMessage>
      </>
    );
  }

  return (
    <Container data-testid="profile-edit-form">
      <FormHeader title="Edit Profile" subtitle="Update your profile information" />

      <Form onSubmit={handleSubmit}>
        <AvatarUpload
          avatarUrl={form.watch('avatar_url')}
          avatarPreview={avatarPreview || undefined}
          onAvatarChange={handleAvatarChange}
          onRemoveAvatar={removeAvatar}
          disabled={submitting}
        />

        <ProfileFormFields register={form.register} control={form.control} disabled={submitting} />

        <ButtonGroup>
          <Button type="submit" variant="primary" disabled={submitting} data-testid="save-profile-button">
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={submitting}
            data-testid="cancel-edit-button"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(props) => props.theme.text.secondary};
  font-size: 1.125rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    flex-direction: row-reverse;
    width: 100%;
    align-items: stretch;

    button {
      flex: 1 1 0;
      min-width: 0;
      width: auto;
    }
  }
`;
