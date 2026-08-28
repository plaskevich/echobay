import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { SellerRatingDisplay } from '@/components/common/SellerRatingDisplay';
import { formatRelativeDate } from '@/lib/formatRelativeDate';
import { breakpoint } from '@/lib/theme/breakpoints';

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
            <i className="hn hn-user" />
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
            {location && (
              <ProfileMeta data-testid="profile-location">
                <i className="hn hn-location-pin" />
                {location}
              </ProfileMeta>
            )}
            {memberSince && (
              <ProfileMeta data-testid="profile-member-since">
                <i className="hn hn-calendar-alt" />
                Member since {formatRelativeDate(memberSince)}
              </ProfileMeta>
            )}
          </MetaRow>
        )}
        {about && (
          <ProfileAbout data-testid="profile-about">
            <i className="hn hn-notebook" />
            {about}
          </ProfileAbout>
        )}
      </ProfileInfo>
      {showEditButton && (
        <ButtonsWrapper>
          <Link to="/profile/edit">
            <Button variant="outline" size="small" data-testid="edit-profile-button">
              <i className="hn hn-pen" />
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
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${breakpoint.sm}) {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
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
  border-radius: 50%;
`;

export const Placeholder = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${(props) => props.theme.background.elevated};
  color: ${(props) => props.theme.text.primary};
  font-size: 3rem;
  border-radius: 50%;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;

  .hn {
    flex-shrink: 0;
  }

  @media (max-width: ${breakpoint.sm}) {
    align-items: center;
  }
`;

const Username = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${(props) => props.theme.text.primary};
  margin: 0;
  line-height: 1.1;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem ${({ theme }) => theme.spacing.md};
  margin-top: 0.1rem;

  @media (max-width: ${breakpoint.sm}) {
    justify-content: center;
  }
`;

const ProfileMeta = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const ProfileAbout = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing['2xs']};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${breakpoint.sm}) {
    text-align: left;

    .hn {
      margin-top: ${({ theme }) => theme.spacing['3xs']};
    }
  }
`;

const ButtonsWrapper = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;

  @media (max-width: ${breakpoint.sm}) {
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
