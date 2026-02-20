import styled from 'styled-components';

import type { ChatWithDetails } from '@/api/messages';
import placeholder from '@/assets/cd.png';
import { ChatListItem } from '@/components/messages/ChatListItem';
import { formatRelativeDate } from '@/lib/formatRelativeDate';

interface ChatListSidebarProps {
  chats: ChatWithDetails[];
  pendingListing?: {
    id: string;
    title: string;
    artist?: string | null;
    images?: string[] | null;
    owner_id: string;
  } | null;
  effectiveChatId: string | undefined;
  profilesMap: Map<string, { username: string | null; avatar_url: string | null }> | undefined;
  unreadChats?: Set<string>;
  isLoading: boolean;
  onSelectChat: (chatId: string) => void;
  getOtherUserInfo: (chat: ChatWithDetails) => { username: string; avatar_url: string | null };
}

export function ChatListSidebar({
  chats,
  pendingListing,
  effectiveChatId,
  profilesMap,
  unreadChats,
  isLoading,
  onSelectChat,
  getOtherUserInfo,
}: ChatListSidebarProps) {
  return (
    <ChatList>
      {isLoading ? (
        <LoadingText>Loading chats...</LoadingText>
      ) : chats.length === 0 && !pendingListing ? (
        <EmptyState>No conversations yet</EmptyState>
      ) : (
        <>
          {pendingListing && (
            <ChatListItem
              key="pending"
              username={profilesMap?.get(pendingListing.owner_id)?.username ?? 'Seller'}
              avatarUrl={profilesMap?.get(pendingListing.owner_id)?.avatar_url ?? null}
              timestamp="Now"
              itemImage={
                pendingListing.images && pendingListing.images.length > 0 ? pendingListing.images[0] : placeholder
              }
              artist={pendingListing.artist}
              title={pendingListing.title}
              isActive={true}
              onClick={() => {}}
            />
          )}
          {chats.map((chat) => {
            const otherUser = getOtherUserInfo(chat);
            const itemImage =
              chat.listings?.images && chat.listings.images.length > 0 ? chat.listings.images[0] : placeholder;
            return (
              <ChatListItem
                key={chat.id}
                username={otherUser.username}
                avatarUrl={otherUser.avatar_url}
                timestamp={formatRelativeDate(chat.updated_at, { short: true })}
                itemImage={itemImage}
                artist={chat.listings?.artist}
                title={chat.listings?.title || 'Unknown item'}
                isActive={chat.id === effectiveChatId}
                hasUnread={unreadChats?.has(chat.id) ?? false}
                onClick={() => onSelectChat(chat.id)}
              />
            );
          })}
        </>
      )}
    </ChatList>
  );
}

const ChatList = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid ${(props) => props.theme.border.primary};
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    border-right: none;
    max-height: none;
    flex: 1;
  }
`;

const LoadingText = styled.p`
  padding: 1.5rem;
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.95rem;
`;

const EmptyState = styled.p`
  padding: 2rem;
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
`;
