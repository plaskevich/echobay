import { useRef } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Placeholder, ProfilePicture } from '@/components/profile/ProfileHeader';
import { breakpoint } from '@/lib/theme/breakpoints';

interface AvatarUploadProps {
  avatarUrl?: string;
  avatarPreview?: string;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  disabled?: boolean;
}

export function AvatarUpload({
  avatarUrl,
  avatarPreview,
  onAvatarChange,
  onRemoveAvatar,
  disabled,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <AvatarRow>
      <AvatarPreviewContainer>
        {avatarPreview || avatarUrl ? (
          <ProfilePicture src={avatarPreview || avatarUrl} alt="Profile" />
        ) : (
          <Placeholder>
            <i className="hn hn-user" />
          </Placeholder>
        )}
      </AvatarPreviewContainer>
      <AvatarInfo>
        <AvatarLabel>Profile photo</AvatarLabel>
        <AvatarHint>JPG, PNG, GIF or WebP.</AvatarHint>
        <AvatarControls>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={onAvatarChange}
            disabled={disabled}
          />
          <Button type="button" variant="outline" size="small" onClick={handleChoosePhoto} disabled={disabled}>
            Choose Photo
          </Button>
          {avatarPreview && (
            <Button type="button" variant="ghost" size="small" onClick={onRemoveAvatar} disabled={disabled}>
              Remove
            </Button>
          )}
        </AvatarControls>
      </AvatarInfo>
    </AvatarRow>
  );
}

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: ${breakpoint.xs}) {
    flex-direction: column;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const AvatarPreviewContainer = styled.div`
  flex-shrink: 0;
`;

const AvatarInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;

  @media (max-width: ${breakpoint.xs}) {
    align-items: center;
  }
`;

const AvatarLabel = styled.span`
  font-size: 0.95rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${(props) => props.theme.text.primary};
`;

const AvatarHint = styled.span`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.text.tertiary};
`;

const AvatarControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  margin-top: 0.6rem;

  @media (max-width: ${breakpoint.xs}) {
    justify-content: center;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;
