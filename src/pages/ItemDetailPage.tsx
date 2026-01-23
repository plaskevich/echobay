import { PiCaretLeft } from 'react-icons/pi';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import placeholder from '@/assets/cd.png';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { BuyerActions } from '@/components/item/item-detail/BuyerActions';
import { ImageGallery } from '@/components/item/item-detail/ImageGallery';
import { ListingInfo } from '@/components/item/item-detail/ListingInfo';
import { OwnerActions } from '@/components/item/item-detail/OwnerActions';
import { useListingActions } from '@/hooks/useListingActions';
import { useListing } from '@/queries/useListings';
import { useAuthStore } from '@/store/auth-store';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: listing, isLoading, error } = useListing(id!);

  const {
    handleSetActive,
    handleMarkAsSold,
    handleHide,
    handleEdit,
    handleDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    confirmDelete,
  } = useListingActions(id!);

  const isOwner = user?.id === listing?.owner_id;

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container>
        <ErrorText>Error: {error instanceof Error ? error.message : 'Listing not found'}</ErrorText>
        <Button onClick={() => navigate('/')}>Back</Button>
      </Container>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : [placeholder];

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <PiCaretLeft /> Back
      </BackButton>

      <Content>
        <ImageGallery images={images} title={listing.title} />

        <DetailsSection>
          <TitleSection>
            <Artist>{listing.artist}</Artist>
            <Title>{listing.title}</Title>
          </TitleSection>
          <Price>{listing.price.toFixed(2)}€</Price>

          <ListingInfo
            format={listing.format}
            condition={listing.condition}
            genre={listing.genre}
            label={listing.label}
          />

          {listing.description && (
            <DescriptionSection>
              <SectionTitle>Description</SectionTitle>
              <Description>{listing.description}</Description>
            </DescriptionSection>
          )}

          <ButtonGroup>
            {isOwner ? (
              <OwnerActions
                status={listing.status}
                onSetActive={handleSetActive}
                onMarkAsSold={handleMarkAsSold}
                onHide={handleHide}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <BuyerActions />
            )}
          </ButtonGroup>
        </DetailsSection>
      </Content>

      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary.main};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;

  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 2rem;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 420px;
    gap: 2rem;
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  min-width: 0;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Artist = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const Price = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.price};
  margin: 0;
`;

const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  padding: 2rem;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.state.error};
  text-align: center;
  padding: 2rem;
`;
