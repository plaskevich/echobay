import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { ErrorMessage, SuccessMessage } from '@/components/common/Message';
import { useProfileEdit } from '@/hooks/useProfileEdit';

import { AvatarUpload } from './AvatarUpload';
import { FormHeader } from './FormHeader';
import { ProfileFormFields } from './ProfileFormFields';

export function ProfileEditForm() {
  const {
    profileData,
    loading,
    submitting,
    error,
    success,
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
    <>
      <FormHeader title="Edit Profile" subtitle="Update your profile information" />

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Profile updated successfully!</SuccessMessage>}

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
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
}

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
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;
