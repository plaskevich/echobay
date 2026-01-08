import { createFileRoute } from '@tanstack/react-router';

import { ListingForm } from '@/components/item/new-listing';
import { Container, Title } from '@/components/item/new-listing/ListingPageLayout';

export const Route = createFileRoute('/items/new')({
  component: NewListing,
});

function NewListing() {
  return (
    <Container>
      <Title>Sell Your Item</Title>
      <ListingForm mode="create" />
    </Container>
  );
}
