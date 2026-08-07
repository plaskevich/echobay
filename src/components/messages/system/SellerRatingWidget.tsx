import { useState } from 'react';
import styled from 'styled-components';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import { useOrderRating, useSubmitRating } from '@/queries/useRatings';
import { useAuthStore } from '@/store/auth-store';

interface SellerRatingWidgetProps {
  orderId: string;
  sellerId: string;
}

export function SellerRatingWidget({ orderId, sellerId }: SellerRatingWidgetProps) {
  const user = useAuthStore((state) => state.user);
  const { data: existingRating, isLoading } = useOrderRating(orderId);
  const submitRating = useSubmitRating();
  const [selectedRating, setSelectedRating] = useState(0);

  if (isLoading || !user) return null;

  if (existingRating) {
    return (
      <RatingContainer data-testid="rating-submitted">
        <RatingLabel>Your rating</RatingLabel>
        <Rating style={{ maxWidth: 120 }} value={existingRating.rating} readOnly />
      </RatingContainer>
    );
  }

  const handleChange = (value: number) => {
    setSelectedRating(value);
  };

  const handleSubmit = () => {
    if (selectedRating === 0) return;
    submitRating.mutate({
      orderId,
      buyerId: user.id,
      sellerId,
      rating: selectedRating,
    });
  };

  return (
    <RatingContainer data-testid="rating-widget">
      <RatingLabel>Rate the seller</RatingLabel>
      <RatingRow>
        <Rating style={{ maxWidth: 150 }} value={selectedRating} onChange={handleChange} />
        {selectedRating > 0 && (
          <SubmitButton onClick={handleSubmit} disabled={submitRating.isPending} data-testid="rating-submit-button">
            {submitRating.isPending ? 'Submitting...' : 'Submit'}
          </SubmitButton>
        )}
      </RatingRow>
    </RatingContainer>
  );
}

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.25rem;
`;

const RatingLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: 0.375rem 0.75rem;
  border: none;
  background-color: ${({ theme }) => theme.primary.main};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;
