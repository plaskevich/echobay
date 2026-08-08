import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SellerRatingDisplay } from '@/components/common/SellerRatingDisplay';
import { useProfile } from '@/queries/useProfiles';
import { useSellerRating } from '@/queries/useRatings';

interface SellerCardProps {
  ownerId: string;
}

export function SellerCard({ ownerId }: SellerCardProps) {
  const { data: sellerProfile } = useProfile(ownerId);
  const { data: sellerRating } = useSellerRating(ownerId);

  return (
    <SellerSection>
      <SectionTitle>Seller</SectionTitle>
      <Card to={`/users/${ownerId}`} data-testid="seller-card">
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
      </Card>
    </SellerSection>
  );
}

const SellerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const Card = styled(Link)`
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
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  display: flex;
  align-items: center;
  border-radius: 50%;
`;

const SellerAvatarPlaceholder = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.5rem;
  background-color: ${({ theme }) => theme.background.elevated};
  border-radius: 50%;
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
