import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { PageContainer as Container } from '@/components/common/PageContainer';
import { LoadingState } from '@/components/common/StateDisplay';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { breakpoint } from '@/lib/theme/breakpoints';

import { AvatarUpload } from './AvatarUpload';
import { FormHeader } from './FormHeader';
import { ProfileFormFields } from './ProfileFormFields';

export function ProfileEditForm() {
  const { form, loading, submitting, avatarPreview, handleAvatarChange, removeAvatar, handleSubmit, handleCancel } =
    useProfileEdit();

  if (loading) {
    return <LoadingState message="Loading profile" />;
  }

  return (
    <Container data-testid="profile-edit-form">
      <FormHeader title="Edit Profile" />

      <Form onSubmit={handleSubmit}>
        <Panel>
          <AvatarUpload
            avatarUrl={form.watch('avatar_url')}
            avatarPreview={avatarPreview || undefined}
            onAvatarChange={handleAvatarChange}
            onRemoveAvatar={removeAvatar}
            disabled={submitting}
          />

          <FieldsPanel>
            <ProfileFormFields register={form.register} control={form.control} disabled={submitting} />
          </FieldsPanel>
        </Panel>

        <ButtonGroup>
          <Button type="submit" variant="primary" disabled={submitting} data-testid="save-profile-button">
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
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

const Panel = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  align-items: start;
  gap: 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing.lg} 0;
  }
`;

const FieldsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${breakpoint.sm}) {
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
