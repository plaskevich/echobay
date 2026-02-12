import { PiUserCircleDuotone } from 'react-icons/pi';
import styled from 'styled-components';

interface ChatListItemProps {
  username: string;
  avatarUrl: string | null;
  timestamp: string;
  itemImage: string;
  artist?: string | null;
  title: string;
  isActive: boolean;
  hasUnread?: boolean;
  onClick: () => void;
}

export function ChatListItem({
  username,
  avatarUrl,
  timestamp,
  itemImage,
  artist,
  title,
  isActive,
  hasUnread = false,
  onClick,
}: ChatListItemProps) {
  return (
    <ChatItem $active={isActive} onClick={onClick} type="button">
      <ChatItemAvatar $hasImage={!!avatarUrl}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <PiUserCircleDuotone size={28} aria-hidden />
        )}
      </ChatItemAvatar>
      <ChatItemContent>
        <ChatItemHeader>
          <ChatItemTitle $unread={hasUnread}>{username}</ChatItemTitle>
          <HeaderRight>
            <ChatItemTimestamp $unread={hasUnread}>{timestamp}</ChatItemTimestamp>
          </HeaderRight>
        </ChatItemHeader>
        <ChatItemRow>
          <ChatItemThumbnail src={itemImage} alt={title} />
          <ChatItemSubtitle>
            {artist && <ChatItemArtist>{artist}</ChatItemArtist>}
            <ChatItemTitleLine>{title}</ChatItemTitleLine>
          </ChatItemSubtitle>
          {hasUnread && <UnreadDot />}
        </ChatItemRow>
      </ChatItemContent>
    </ChatItem>
  );
}

const ChatItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
  background: ${({ theme, $active }) => ($active ? theme.background.secondary : 'transparent')};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.background.secondaryHover : theme.background.primaryHover)};
  }
`;

const ChatItemAvatar = styled.div<{ $hasImage?: boolean }>`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  background: ${({ theme, $hasImage }) => ($hasImage ? 'transparent' : theme.background.tertiary)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.secondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ChatItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const ChatItemHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`;

const ChatItemTitle = styled.div<{ $unread?: boolean }>`
  font-weight: ${({ $unread }) => ($unread ? 700 : 600)};
  font-size: 0.95rem;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HeaderRight = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const ChatItemTimestamp = styled.span<{ $unread?: boolean }>`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: ${({ theme, $unread }) => ($unread ? theme.primary.main : theme.text.tertiary)};
  font-weight: ${({ $unread }) => ($unread ? 600 : 400)};
`;

const UnreadDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  background-color: ${(props) => props.theme.primary.main};
`;

const ChatItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const ChatItemSubtitle = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  overflow: hidden;
`;

const ChatItemArtist = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatItemTitleLine = styled.span`
  font-size: 0.85rem;
  color: ${(props) => props.theme.text.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatItemThumbnail = styled.img`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;
