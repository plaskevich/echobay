import { useParams } from 'react-router-dom';

import { PageContainer as Container } from '@/components/common/PageContainer';
import { ErrorState, LoadingState } from '@/components/common/StateDisplay';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserListings } from '@/components/profile/UserListings';
import { usePublicUserListings } from '@/queries/useListings';
import { usePublicProfile } from '@/queries/useProfiles';
import { useSellerRating } from '@/queries/useRatings';
import { useAuthStore } from '@/store/auth-store';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const isOwnProfile = user?.id === id;

  const { data: profile, isLoading: profileLoading } = usePublicProfile(id);
  const { data: listings = [], isLoading: listingsLoading, error: listingsError } = usePublicUserListings(id);
  const { data: sellerRating } = useSellerRating(id);

  if (profileLoading) {
    return (
      <Container>
        <LoadingState message="Loading profile" />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <ErrorState message="User not found" />
      </Container>
    );
  }

  const displayName = profile.username || 'User';

  return (
    <Container>
      <ProfileHeader
        avatarUrl={profile.avatar_url}
        username={displayName}
        memberSince={profile.created_at}
        location={profile.location}
        about={profile.about}
        ratingAverage={sellerRating?.average}
        ratingCount={sellerRating?.count}
        showEditButton={isOwnProfile}
      />
      <UserListings
        listings={listings}
        isLoading={listingsLoading}
        error={listingsError}
        emptyMessage="No active listings"
      />
    </Container>
  );
}
