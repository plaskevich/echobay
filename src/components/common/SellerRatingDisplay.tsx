import styled from 'styled-components';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

interface SellerRatingDisplayProps {
  average: number;
  count: number;
}

export function SellerRatingDisplay({ average, count }: SellerRatingDisplayProps) {
  if (count === 0) {
    return <NoRatings data-testid="no-ratings">No ratings yet</NoRatings>;
  }

  return (
    <Container data-testid="seller-rating">
      <Rating style={{ maxWidth: 100 }} value={average} readOnly />
      <RatingText>
        <Average>{average.toFixed(1)}</Average>
        <Count>
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </Count>
      </RatingText>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NoRatings = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const RatingText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;

const Average = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const Count = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.secondary};
`;
