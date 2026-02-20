import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserListings } from '@/components/profile/UserListings';
import { usePublicUserListings } from '@/queries/useListings';
import { usePublicProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const isOwnProfile = user?.id === id;

  const { data: profile, isLoading: profileLoading } = usePublicProfile(id);
  const { data: listings = [], isLoading: listingsLoading, error: listingsError } = usePublicUserListings(id);

  if (profileLoading) {
    return (
      <Container>
        <LoadingText>Loading profile...</LoadingText>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <ErrorText>User not found</ErrorText>
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
        showEditButton={isOwnProfile}
      />
      <UserListings
        listings={listings}
        title={isOwnProfile ? 'My Listings' : `${displayName}'s Listings`}
        isLoading={listingsLoading}
        error={listingsError}
        emptyMessage="No active listings"
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const LoadingText = styled.p`
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
  padding: 2rem;
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.state.error};
  text-align: center;
  padding: 2rem;
`;
