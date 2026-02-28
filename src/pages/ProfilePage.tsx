import { useMemo, useState } from 'react';
import { PiPlusCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import type { ListingStatus } from '@/components/listings/ListingCard';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserListings } from '@/components/profile/UserListings';
import { useUserListings } from '@/queries/useListings';
import { useProfile } from '@/queries/useProfiles';
import { useSellerRating } from '@/queries/useRatings';
import { useAuthStore } from '@/store/auth-store';

type StatusFilter = 'all' | ListingStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
];

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: listings = [], isLoading: listingsLoading, error: listingsError } = useUserListings(user?.id);
  const { data: sellerRating } = useSellerRating(user?.id);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredListings = useMemo(() => {
    const filtered = statusFilter === 'all' ? listings : listings.filter((l) => l.status === statusFilter);
    return [...filtered].sort((a, b) => (a.status === 'sold' ? 1 : 0) - (b.status === 'sold' ? 1 : 0));
  }, [listings, statusFilter]);

  if (!user) return null;

  return (
    <Container>
      <ProfileHeader
        avatarUrl={profile?.avatar_url}
        username={profile?.username || user.email || 'User'}
        memberSince={user.created_at}
        location={profile?.location}
        about={profile?.about}
        ratingAverage={sellerRating?.average}
        ratingCount={sellerRating?.count}
        isLoading={profileLoading}
        showEditButton
      />
      <UserListings
        listings={filteredListings}
        title="My Listings"
        isLoading={listingsLoading}
        error={listingsError}
        emptyMessage={statusFilter === 'all' ? "You haven't created any listings yet" : `No ${statusFilter} listings`}
        emptyAction={
          statusFilter === 'all' ? (
            <Button onClick={() => navigate('/items/new')} variant="primary" size="medium">
              <PiPlusCircle size={20} />
              Create Your First Listing
            </Button>
          ) : undefined
        }
        headerExtra={
          listings.length > 0 && (
            <FilterTabs data-testid="status-filters">
              {STATUS_FILTERS.map((f) => (
                <FilterTab
                  key={f.value}
                  $active={statusFilter === f.value}
                  onClick={() => setStatusFilter(f.value)}
                  data-testid={`status-filter-${f.value}`}
                >
                  {f.label}
                </FilterTab>
              ))}
            </FilterTabs>
          )
        }
      />
    </Container>
  );
}

const Container = styled.div`
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 640px) {
    flex: 1;
  }
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => (props.$active ? props.theme.primary.main : props.theme.border.primary)};
  background-color: ${(props) => (props.$active ? props.theme.primary.light : props.theme.background.primary)};
  color: ${(props) => (props.$active ? props.theme.primary.main : props.theme.text.primary)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.primary.main};
    background-color: ${(props) => props.theme.primary.light};
    color: ${(props) => props.theme.primary.main};
  }
`;
