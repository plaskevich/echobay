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
import { SellerRatingDisplay } from '@/components/common/SellerRatingDisplay';
import { formatRelativeDate } from '@/lib/formatRelativeDate';

export interface ProfileHeaderProps {
  avatarUrl?: string | null;
  username: string;
  memberSince?: string | null;
  location?: string | null;
  about?: string | null;
  ratingAverage?: number;
  ratingCount?: number;
  isLoading?: boolean;
  showEditButton?: boolean;
}

export function ProfileHeader({
  avatarUrl,
  username,
  memberSince,
  location,
  about,
  ratingAverage,
  ratingCount,
  isLoading,
  showEditButton,
}: ProfileHeaderProps) {
  return (
    <Header data-testid="profile-header">
      <ProfilePictureContainer>
        {isLoading || !avatarUrl ? (
          <Placeholder>
            <PiUserCircleDuotone size={120} />
          </Placeholder>
        ) : (
          <ProfilePicture src={avatarUrl} alt={username} />
        )}
      </ProfilePictureContainer>
      <ProfileInfo>
        <Username data-testid="profile-username">{username}</Username>
        <SellerRatingDisplay average={ratingAverage ?? 0} count={ratingCount ?? 0} />
        {(memberSince || location) && (
          <MetaRow>
            {memberSince && (
              <ProfileMeta data-testid="profile-member-since">
                <PiCalendarDuotone size={15} />
                Member since {formatRelativeDate(memberSince)}
              </ProfileMeta>
            )}
            {location && (
              <ProfileMeta data-testid="profile-location">
                <PiMapPinDuotone size={15} />
                {location}
              </ProfileMeta>
            )}
          </MetaRow>
        )}
        {about && (
          <ProfileAbout data-testid="profile-about">
            <PiNotePencilDuotone size={16} />
            {about}
          </ProfileAbout>
        )}
      </ProfileInfo>
      {showEditButton && (
        <ButtonsWrapper>
          <Link to="/profile/edit">
            <Button variant="outline" size="medium" data-testid="edit-profile-button">
              <PiPencilSimpleLineDuotone size={20} />
              Edit Profile
            </Button>
          </Link>
        </ButtonsWrapper>
      )}
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1.75rem;
  background: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.border.primary};
  box-shadow: ${(props) => props.theme.elevation.sm};
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
    padding: 1.5rem 1rem;
    margin-bottom: 1.25rem;
  }
`;

const ProfilePictureContainer = styled.div`
  flex-shrink: 0;
`;

export const ProfilePicture = styled.img.attrs({
  referrerPolicy: 'no-referrer',
})`
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.background.secondary};
  box-shadow: 0 0 0 3px ${(props) => props.theme.primary.light};
`;

export const Placeholder = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${(props) => props.theme.background.tertiary};
  color: ${(props) => props.theme.text.tertiary};
  border: 2px solid ${(props) => props.theme.background.secondary};
  box-shadow: 0 0 0 3px ${(props) => props.theme.primary.light};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    align-items: center;
  }
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
  line-height: 1.1;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
  margin-top: 0.1rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const ProfileMeta = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const ProfileAbout = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  margin-top: 0.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  @media (max-width: 640px) {
    text-align: left;

    svg {
      margin-top: 0.125rem;
    }
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
