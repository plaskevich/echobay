import { useRef } from 'react';
import { PiUserCircleDuotone } from 'react-icons/pi';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Placeholder, ProfilePicture } from '@/components/profile/ProfileHeader';

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
            <PiUserCircleDuotone size={120} />
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

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
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

  @media (max-width: 480px) {
    align-items: center;
  }
`;

const AvatarLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
`;

const AvatarHint = styled.span`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.text.tertiary};
`;

const AvatarControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.6rem;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;
