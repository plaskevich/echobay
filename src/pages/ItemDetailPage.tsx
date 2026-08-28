import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import type { GenreRef } from '@/api/genres';
import { Dialog } from '@/components/common/Dialog';
import { ErrorPage } from '@/components/common/ErrorPage';
import { BuyerActions } from '@/components/item/item-detail/BuyerActions';
import { ImageGallery } from '@/components/item/item-detail/ImageGallery';
import { GALLERY_MAX_WIDTH } from '@/components/item/item-detail/ImageGallery';
import { ItemDetailSkeleton } from '@/components/item/item-detail/ItemDetailSkeleton';
import { ListingDescription } from '@/components/item/item-detail/ListingDescription';
import { ListingHeader } from '@/components/item/item-detail/ListingHeader';
import { ListingInfo } from '@/components/item/item-detail/ListingInfo';
import { OwnerActions } from '@/components/item/item-detail/OwnerActions';
import { SellerCard } from '@/components/item/item-detail/SellerCard';
import { useListingActions } from '@/hooks/useListingActions';
import { useLogView } from '@/hooks/useLogView';
import { breakpoint } from '@/lib/theme/breakpoints';
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

  useLogView(listing?.id);

  if (isLoading) {
    return (
      <Container>
        <ItemDetailSkeleton />
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container>
        {error ? (
          <ErrorPage message={error instanceof Error ? error.message : undefined} />
        ) : (
          <ErrorPage notFound title="Listing not found" message="This listing doesn't exist or has been removed." />
        )}
      </Container>
    );
  }

  const genres = listing.listing_genres?.map((lg: { genres: GenreRef }) => lg.genres).filter(Boolean) || [];

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <i className="hn hn-angle-left" /> Back
      </BackButton>

      <Content>
        <ImageGallery
          images={listing.images ?? []}
          format={listing.format}
          title={listing.title}
          status={listing.status}
        />

        <DetailsSection>
          <ListingHeader
            artist={listing.artist}
            title={listing.title}
            price={listing.price}
            shippingPrice={listing.shipping_price}
            listingId={listing.id}
            isOwner={isOwner}
          />

          <ListingInfo
            format={listing.format}
            condition={listing.condition}
            genres={genres}
            label={listing.label}
            year={listing.year}
          />

          <ListingDescription description={listing.description} />

          {!isOwner && <SellerCard ownerId={listing.owner_id} />}

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
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${breakpoint.md}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  i {
    font-size: ${({ theme }) => theme.fontSize.base};
    transition: transform ${({ theme }) => theme.transition.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.primary.main};

    i {
      transform: translateX(-2px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${breakpoint.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  align-items: start;

  @media (min-width: ${breakpoint.md}) {
    grid-template-columns: minmax(0, ${GALLERY_MAX_WIDTH}) minmax(0, 500px);
    justify-content: start;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${breakpoint.lg}) {
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  min-width: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;
