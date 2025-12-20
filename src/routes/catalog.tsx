import { createFileRoute } from '@tanstack/react-router';

import { CatalogView } from '@/components/catalog/CatalogView';

export const Route = createFileRoute('/catalog')({
  component: Catalog,
});

function Catalog() {
  return <CatalogView />;
}
