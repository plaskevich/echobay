import { createFileRoute } from '@tanstack/react-router';

import { CatalogView } from '@/components/listings/CatalogView';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <CatalogView />;
}
