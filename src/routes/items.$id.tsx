import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/items/$id')({
  component: ItemsIdLayout,
});

function ItemsIdLayout() {
  return <Outlet />;
}
