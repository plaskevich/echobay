import { createFileRoute, useParams } from '@tanstack/react-router';

import { ListingForm } from '@/components/item/new-listing';
import { Container, Title } from '@/components/item/new-listing/ListingPageLayout';

function EditListingPage() {
  const { id } = useParams({ from: '/items/$id/edit' });
  return (
    <Container>
      <Title>Edit Listing</Title>
      <ListingForm listingId={id} mode="edit" />
    </Container>
  );
}

export const Route = createFileRoute('/items/$id/edit')({
  component: EditListingPage,
});
