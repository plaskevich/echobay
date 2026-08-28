import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import type { ListingStatus } from '@/api/listings';
import { Button } from '@/components/common/Button';
import { PageContainer as Container } from '@/components/common/PageContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserListings } from '@/components/profile/UserListings';
import { breakpoint } from '@/lib/theme/breakpoints';
import { useUserListings } from '@/queries/useListings';
import { useProfile } from '@/queries/useProfiles';
import { useSellerRating } from '@/queries/useRatings';
import { useAuthStore } from '@/store/auth-store';

type StatusFilter = 'all' | ListingStatus;

const STATUS_ORDER: ListingStatus[] = ['active', 'hidden', 'sold'];

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
    return [...filtered].sort((a, b) => STATUS_ORDER.indexOf(a.status!) - STATUS_ORDER.indexOf(b.status!));
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
        isLoading={listingsLoading}
        error={listingsError}
        emptyMessage={statusFilter === 'all' ? "You haven't created any listings yet" : `No ${statusFilter} listings`}
        emptyAction={
          statusFilter === 'all' ? (
            <Button onClick={() => navigate('/items/new')} variant="primary" size="medium">
              <i className="hn hn-plus" aria-hidden />
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

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 1.25rem;

  @media (max-width: ${breakpoint.sm}) {
    width: 100%;
  }
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  white-space: nowrap;

  @media (max-width: ${breakpoint.sm}) {
    flex: 1;
  }
  border: 1px solid ${(props) => (props.$active ? props.theme.black.main : props.theme.border.primary)};
  background-color: ${(props) => (props.$active ? props.theme.black.main : props.theme.background.primary)};
  color: ${(props) => (props.$active ? props.theme.text.inverse : props.theme.text.primary)};
  cursor: pointer;
  transition: all ${(props) => props.theme.transition.base};

  &:hover {
    border-color: ${(props) => props.theme.border.hover};
  }
`;
