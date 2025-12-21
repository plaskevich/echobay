import { createFileRoute } from '@tanstack/react-router';

import { ItemDetail } from '@/components/item/item-detail/ItemDetail';

export const Route = createFileRoute('/items/$id')({
  component: ItemDetail,
});
