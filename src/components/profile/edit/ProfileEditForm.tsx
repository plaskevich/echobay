import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { useProfileEdit } from '@/hooks/useProfileEdit';

import { AvatarUpload } from './AvatarUpload';
import { FormHeader } from './FormHeader';
import { ProfileFormFields } from './ProfileFormFields';

export function ProfileEditForm() {
  const {
    profileData,
    loading,
    submitting,
    avatarPreview,
    updateField,
    handleAvatarChange,
    removeAvatar,
    handleSubmit,
    handleCancel,
  } = useProfileEdit();

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
          avatarUrl={profileData.avatar_url}
          avatarPreview={avatarPreview || undefined}
          onAvatarChange={handleAvatarChange}
          onRemoveAvatar={removeAvatar}
          disabled={submitting}
        />

        <ProfileFormFields
          username={profileData.username}
          location={profileData.location}
          about={profileData.about}
          onUsernameChange={(value) => updateField('username', value)}
          onLocationChange={(value) => updateField('location', value)}
          onAboutChange={(value) => updateField('about', value)}
          disabled={submitting}
        />

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

    button {
      width: 50%;
    }
  }
`;
