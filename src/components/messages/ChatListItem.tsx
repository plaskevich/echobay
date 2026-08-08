import styled from 'styled-components';

import { getFormatIcon } from '@/lib/getFormatIcon';

interface ChatListItemProps {
  username: string;
  avatarUrl: string | null;
  timestamp: string;
  itemImage: string | null;
  itemFormat?: string | null;
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
  itemFormat,
  artist,
  title,
  isActive,
  hasUnread = false,
  onClick,
}: ChatListItemProps) {
  return (
    <ChatItem $active={isActive} onClick={onClick} type="button" data-testid="chat-list-item">
      <ChatItemAvatar>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <i className="hn hn-user" aria-hidden />
        )}
      </ChatItemAvatar>
      <ChatItemContent>
        <ChatItemHeader>
          <ChatItemTitle $unread={hasUnread} data-testid="chat-item-username">
            {username}
          </ChatItemTitle>
          <HeaderRight>
            <ChatItemTimestamp $unread={hasUnread}>{timestamp}</ChatItemTimestamp>
          </HeaderRight>
        </ChatItemHeader>
        <ChatItemRow>
          {itemImage ? (
            <ChatItemThumbnail src={itemImage} alt={title} />
          ) : (
            <ChatItemFormatFallback aria-label="Listing format icon">
              {getFormatIcon(itemFormat, 20)}
            </ChatItemFormatFallback>
          )}
          <ChatItemSubtitle>
            <ChatItemTitleLine data-testid="chat-item-title">{title}</ChatItemTitleLine>
            {artist && <ChatItemArtist data-testid="chat-item-artist">{artist}</ChatItemArtist>}
          </ChatItemSubtitle>
          {hasUnread && <UnreadDot data-testid="chat-item-unread" />}
        </ChatItemRow>
      </ChatItemContent>
    </ChatItem>
  );
}

const ChatItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.border.hover : theme.border.primary)};
  background: ${({ theme, $active }) => ($active ? theme.background.secondary : 'transparent')};
  text-align: left;
  transition: border-color ${(props) => props.theme.transition.fast};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.border.hover};
  }
`;

const ChatItemAvatar = styled.div`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
  background: ${(props) => props.theme.background.elevated};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.25rem;

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
  font-size: 0.875rem;
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
  font-size: 0.725rem;
  color: ${(props) => props.theme.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatItemTitleLine = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatItemThumbnail = styled.img`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  object-fit: cover;
`;

const ChatItemFormatFallback = styled.div`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background-color: ${(props) => props.theme.background.elevated};
  color: ${(props) => props.theme.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;
