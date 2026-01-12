import { useEffect, useState } from 'react';
import { PiUserCircleDuotone } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

export function ProfileHeader() {
  const user = useAuthStore((state) => state.user);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [about, setAbout] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, username, location, about')
          .eq('id', user.id)
          .single();

        if (data?.avatar_url) {
          setProfilePicture(data.avatar_url);
        }
        if (data?.username) {
          setUsername(data.username);
        }
        if (data?.location) {
          setLocation(data.location);
        }
        if (data?.about) {
          setAbout(data.about);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Header>
      <ProfilePictureContainer>
        {loading ? (
          <Placeholder>
            <PiUserCircleDuotone size={120} />
          </Placeholder>
        ) : profilePicture ? (
          <ProfilePicture src={profilePicture} alt="Profile" />
        ) : (
          <Placeholder>
            <PiUserCircleDuotone size={120} />
          </Placeholder>
        )}
      </ProfilePictureContainer>
      <ProfileInfo>
        <Username>{username || user.email}</Username>
        <ProfileMeta>Member since {new Date(user.created_at).toLocaleDateString()}</ProfileMeta>
        {location && <ProfileMeta>{location}</ProfileMeta>}
        {about && <ProfileAbout>{about}</ProfileAbout>}
      </ProfileInfo>
      <EditButtonWrapper>
        <Link to="/profile/edit">
          <Button variant="outline" size="medium">
            Edit Profile
          </Button>
        </Link>
      </EditButtonWrapper>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: ${(props) => props.theme.background.secondary};
  border-radius: 0.75rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfilePictureContainer = styled.div`
  flex-shrink: 0;
`;

export const ProfilePicture = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.border.primary};
`;

export const Placeholder = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
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
`;

const ProfileAbout = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  margin-top: 0.25rem;
  max-width: 300px;
`;

const EditButtonWrapper = styled.div`
  margin-left: auto;

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
