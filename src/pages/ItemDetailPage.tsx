import { PiCaretLeft } from 'react-icons/pi';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import placeholder from '@/assets/cd.png';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { PageTitle } from '@/components/common/PageTitle';
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

  const genres =
    listing.listing_genres
      ?.map((lg: { genres: { id: string; name: string; slug: string } }) => lg.genres)
      .filter(Boolean) || [];

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <PiCaretLeft /> Back
      </BackButton>

      <Content>
        <ImageGallery
          images={images}
          title={listing.title}
          listingId={listing.id}
          isOwner={isOwner}
          status={listing.status}
        />

        <DetailsSection>
          <TitleSection>
            <Artist>{listing.artist}</Artist>
            <PageTitle>{listing.title}</PageTitle>
          </TitleSection>
          <Price>{listing.price.toFixed(2)}€</Price>

          <ListingInfo format={listing.format} condition={listing.condition} genres={genres} label={listing.label} />

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
              listing.status === 'active' && <BuyerActions listingId={listing.id} />
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
  padding: 0;
  box-sizing: border-box;
  padding: 2rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem 0.4rem 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  svg {
    font-size: 1rem;
    transition: transform 0.15s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.background.secondaryHover};
    color: ${({ theme }) => theme.text.primary};
    border-color: ${({ theme }) => theme.border.hover};

    svg {
      transform: translateX(-2px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 640px) {
    margin-bottom: 1rem;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 1.5rem;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1fr minmax(0, 300px);
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr minmax(0, 420px);
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

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const Price = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.price};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
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
