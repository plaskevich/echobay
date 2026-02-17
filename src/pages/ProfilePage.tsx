import styled from 'styled-components';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserListings } from '@/components/profile/UserListings';

export default function ProfilePage() {
  return (
    <Container>
      <ProfileHeader />
      <UserListings />
    </Container>
  );
}

const Container = styled.div`
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;
