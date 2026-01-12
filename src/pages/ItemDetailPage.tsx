import { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import placeholder from '@/assets/cd.png';
import { Button } from '@/components/common/Button';
import { BuyerActions } from '@/components/item/item-detail/BuyerActions';
import { ImageGallery } from '@/components/item/item-detail/ImageGallery';
import { ListingInfo } from '@/components/item/item-detail/ListingInfo';
import { OwnerActions } from '@/components/item/item-detail/OwnerActions';
import { useListingActions } from '@/hooks/useListingActions';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

interface ListingDetail {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  images?: string[];
  genre?: string;
  label?: string;
  format?: string;
  condition?: string;
  created_at: string;
  owner_id: string;
}

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleMarkAsSold, handleHide, handleEdit, handleDelete } = useListingActions(id!);

  useEffect(() => {
    async function fetchListing() {
      try {
        const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();

        if (error) throw error;
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  const isOwner = user?.id === listing?.owner_id;

  if (loading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container>
        <ErrorText>Error: {error || 'Listing not found'}</ErrorText>
        <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
      </Container>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : [placeholder];

  return (
    <Container>
      <BackButton onClick={() => navigate('/catalog')}>
        <IoChevronBack /> Back
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
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

  @media (min-width: 768px) {
    grid-template-columns: auto 1fr;
    max-width: 1000px;
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  color: ${({ theme }) => theme.state.success};
  margin: 1rem 0 0 0;
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
  margin-top: auto;
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
