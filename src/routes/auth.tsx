import { createFileRoute } from '@tanstack/react-router';

import { Auth } from '@/components/auth/Auth';

export const Route = createFileRoute('/auth')({
  component: Auth,
});
