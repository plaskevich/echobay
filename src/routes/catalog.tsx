import { createFileRoute } from '@tanstack/react-router';

import { CatalogView } from '@/components/listings/CatalogView';

export const Route = createFileRoute('/catalog')({
  component: Catalog,
});

function Catalog() {
  return <CatalogView />;
}
