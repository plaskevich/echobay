import styled from 'styled-components';

import { createFileRoute } from '@tanstack/react-router';

import { NewListingForm } from '@/components/listings/NewListingForm';

export const Route = createFileRoute('/items/new')({
  component: NewListing,
});

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
  margin-bottom: 2rem;
`;

function NewListing() {
  return (
    <Container>
      <Title>Sell Your Item</Title>
      <NewListingForm />
    </Container>
  );
}
