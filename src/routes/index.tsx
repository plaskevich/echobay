import { createFileRoute } from '@tanstack/react-router';

import { CatalogView } from '@/components/catalog/CatalogView';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <CatalogView />;
}
