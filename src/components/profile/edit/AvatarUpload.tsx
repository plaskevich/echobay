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
    <AvatarSection>
      <AvatarPreviewContainer>
        {avatarPreview || avatarUrl ? (
          <ProfilePicture src={avatarPreview || avatarUrl} alt="Profile" />
        ) : (
          <Placeholder>
            <PiUserCircleDuotone size={120} />
          </Placeholder>
        )}
      </AvatarPreviewContainer>
      <AvatarControls>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onAvatarChange}
          disabled={disabled}
        />
        <Button type="button" variant="outline" onClick={handleChoosePhoto} disabled={disabled}>
          Choose Photo
        </Button>
        {avatarPreview && (
          <Button type="button" variant="ghost" onClick={onRemoveAvatar} disabled={disabled}>
            Remove
          </Button>
        )}
      </AvatarControls>
    </AvatarSection>
  );
}

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: ${(props) => props.theme.background.secondary};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.border.primary};
  margin-bottom: 2rem;
`;

const AvatarPreviewContainer = styled.div`
  flex-shrink: 0;
`;

const AvatarControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
