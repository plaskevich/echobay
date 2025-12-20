import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/favorites')({
  component: Favorites,
});

function Favorites() {
  return <div>Hello "/favorites"!</div>;
}
