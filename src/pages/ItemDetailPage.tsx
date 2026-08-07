import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { SellerRatingDisplay } from '@/components/common/SellerRatingDisplay';
import { BuyerActions } from '@/components/item/item-detail/BuyerActions';
import { ImageGallery } from '@/components/item/item-detail/ImageGallery';
import { ItemDetailSkeleton } from '@/components/item/item-detail/ItemDetailSkeleton';
import { ListingInfo } from '@/components/item/item-detail/ListingInfo';
import { OwnerActions } from '@/components/item/item-detail/OwnerActions';
import { useListingActions } from '@/hooks/useListingActions';
import { useLogView } from '@/hooks/useLogView';
import { formatPrice } from '@/lib/utils';
import { useListing } from '@/queries/useListings';
import { useProfile } from '@/queries/useProfiles';
import { useSellerRating } from '@/queries/useRatings';
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
  const { data: sellerProfile } = useProfile(listing?.owner_id);
  const { data: sellerRating } = useSellerRating(listing?.owner_id);

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
        <ErrorText>Error: {error instanceof Error ? error.message : 'Listing not found'}</ErrorText>
        <Button onClick={() => navigate('/')}>Back</Button>
      </Container>
    );
  }

  const genres =
    listing.listing_genres
      ?.map((lg: { genres: { id: string; name: string; slug: string } }) => lg.genres)
      .filter(Boolean) || [];

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
          listingId={listing.id}
          isOwner={isOwner}
          status={listing.status}
        />

        <DetailsSection>
          <TitleSection>
            <Artist data-testid="artist">{listing.artist}</Artist>
            <Title data-testid="title">{listing.title}</Title>
          </TitleSection>
          <PriceSection>
            <Price data-testid="listing-price">{formatPrice(listing.price)}</Price>
            {listing.shipping_price != null && listing.shipping_price > 0 ? (
              <ShippingPrice data-testid="listing-shipping">
                + {formatPrice(listing.shipping_price)} shipping
              </ShippingPrice>
            ) : (
              <ShippingPrice data-testid="listing-shipping">Free shipping</ShippingPrice>
            )}
          </PriceSection>

          <ListingInfo
            format={listing.format}
            condition={listing.condition}
            genres={genres}
            label={listing.label}
            year={listing.year}
          />

          {listing.description && (
            <DescriptionSection>
              <SectionTitle>Description</SectionTitle>
              <Description data-testid="listing-description">{listing.description}</Description>
            </DescriptionSection>
          )}

          <SellerSection>
            <SectionTitle>Seller</SectionTitle>
            <SellerCard to={`/users/${listing.owner_id}`} data-testid="seller-card">
              <SellerAvatarContainer>
                {sellerProfile?.avatar_url ? (
                  <SellerAvatar src={sellerProfile.avatar_url} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <SellerAvatarPlaceholder>
                    <i className="hn hn-user" />
                  </SellerAvatarPlaceholder>
                )}
              </SellerAvatarContainer>
              <SellerInfo>
                <SellerName data-testid="seller-name">{sellerProfile?.username || 'Seller'}</SellerName>
                {sellerProfile?.location && (
                  <SellerLocation data-testid="seller-location">
                    <i className="hn hn-location-pin" />
                    {sellerProfile.location}
                  </SellerLocation>
                )}
                <SellerRatingDisplay average={sellerRating?.average ?? 0} count={sellerRating?.count ?? 0} />
              </SellerInfo>
              <ViewProfileArrow>
                <i className="hn hn-angle-right" />
              </ViewProfileArrow>
            </SellerCard>
          </SellerSection>

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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  padding: 2rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 0.15s ease;

  i {
    font-size: 1rem;
    transition: transform 0.15s ease;
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

  @media (max-width: 640px) {
    margin-bottom: 1rem;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 1.5rem;
  width: 100%;
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 300px) 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 380px) 1fr;
    gap: 2.5rem;
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-width: 0;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Artist = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: -0.5rem;
`;

const Price = styled.p`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.primary.main};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const ShippingPrice = styled.p`
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: 500;
  color: ${({ theme }) => theme.text.muted};
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

const SellerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SellerCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  text-decoration: none;
  color: inherit;
`;

const SellerAvatarContainer = styled.div`
  flex-shrink: 0;
`;

const SellerAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const SellerAvatarPlaceholder = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.5rem;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`;

const SellerName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const SellerLocation = styled.span`
  font-size: 0.725rem;
  color: ${({ theme }) => theme.text.tertiary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ViewProfileArrow = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.text.tertiary};
  display: flex;
  align-items: center;
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.state.error};
  text-align: center;
  padding: 2rem;
`;
