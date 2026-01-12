import { createFileRoute } from '@tanstack/react-router';

import ProfilePage from '@/components/profile/ProfilePAge';

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
});
