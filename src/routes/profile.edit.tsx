import { createFileRoute } from '@tanstack/react-router';

import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm';

export const Route = createFileRoute('/profile/edit')({
  component: ProfileEditPage,
});

function ProfileEditPage() {
  return <ProfileEditForm />;
}
