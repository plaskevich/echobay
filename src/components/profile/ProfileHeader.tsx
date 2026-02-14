import {
  PiCalendarDuotone,
  PiMapPinDuotone,
  PiNotePencilDuotone,
  PiPencilSimpleLineDuotone,
  PiUserCircleDuotone,
} from 'react-icons/pi';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { useProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';

export function ProfileHeader() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useProfile(user?.id);

  if (!user) {
    return null;
  }

  return (
    <Header>
      <ProfilePictureContainer>
        {isLoading ? (
          <Placeholder>
            <PiUserCircleDuotone size={120} />
          </Placeholder>
        ) : profile?.avatar_url ? (
          <ProfilePicture src={profile.avatar_url} alt="Profile" />
        ) : (
          <Placeholder>
            <PiUserCircleDuotone size={120} />
          </Placeholder>
        )}
      </ProfilePictureContainer>
      <ProfileInfo>
        <Username>{profile?.username || user.email}</Username>
        <ProfileMeta>
          <PiCalendarDuotone size={16} />
          Member since {new Date(user.created_at).toLocaleDateString()}
        </ProfileMeta>
        {profile?.location && (
          <ProfileMeta>
            <PiMapPinDuotone size={16} />
            {profile.location}
          </ProfileMeta>
        )}
        {profile?.about && (
          <ProfileAbout>
            <PiNotePencilDuotone size={16} />
            {profile.about}
          </ProfileAbout>
        )}
      </ProfileInfo>
      <ButtonsWrapper>
        <Link to="/profile/edit">
          <Button variant="outline" size="medium">
            <PiPencilSimpleLineDuotone size={20} />
            Edit Profile
          </Button>
        </Link>
      </ButtonsWrapper>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: ${(props) => props.theme.background.tertiary};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.border.primary};
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
    padding: 1.5rem 1rem;
    margin-bottom: 1.5rem;
  }
`;

const ProfilePictureContainer = styled.div`
  flex-shrink: 0;
`;

export const ProfilePicture = styled.img.attrs({
  referrerPolicy: 'no-referrer',
})`
  width: 6rem;
  height: 6rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.border.primary};
`;

export const Placeholder = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text.tertiary};
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;

const ProfileMeta = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const ProfileAbout = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  margin-top: 0.25rem;
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    justify-content: center;
    max-width: none;
  }
`;

const ButtonsWrapper = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.75rem;
  flex-direction: column;

  @media (max-width: 640px) {
    margin-left: 0;
    width: 100%;

    a {
      display: block;
      width: 100%;
    }

    button {
      width: 100%;
    }
  }
`;
