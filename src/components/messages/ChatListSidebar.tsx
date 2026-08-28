import styled from 'styled-components';

import type { ChatWithDetails } from '@/api/messages';
import { EmptyState } from '@/components/common/StateDisplay';
import { ChatListItem } from '@/components/messages/ChatListItem';
import { ChatListItemSkeleton } from '@/components/messages/ChatListItemSkeleton';
import { formatRelativeDate } from '@/lib/formatRelativeDate';
import { breakpoint } from '@/lib/theme/breakpoints';

interface ChatListSidebarProps {
  chats: ChatWithDetails[];
  pendingListing?: {
    id: string;
    title: string;
    artist?: string | null;
    format?: string | null;
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
    <ChatList data-testid="chat-list">
      {isLoading ? (
        <LoadingList data-testid="chat-list-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <ChatListItemSkeleton key={i} />
          ))}
        </LoadingList>
      ) : chats.length === 0 && !pendingListing ? (
        <EmptyState message="No conversations yet" data-testid="chat-list-empty" />
      ) : (
        <>
          {pendingListing && (
            <ChatListItem
              key="pending"
              username={profilesMap?.get(pendingListing.owner_id)?.username ?? 'Seller'}
              avatarUrl={profilesMap?.get(pendingListing.owner_id)?.avatar_url ?? null}
              timestamp="Now"
              itemImage={pendingListing.images && pendingListing.images.length > 0 ? pendingListing.images[0] : null}
              itemFormat={pendingListing.format}
              artist={pendingListing.artist}
              title={pendingListing.title}
              isActive={true}
              onClick={() => {}}
            />
          )}
          {chats.map((chat) => {
            const otherUser = getOtherUserInfo(chat);
            const itemImage = chat.listings?.images && chat.listings.images.length > 0 ? chat.listings.images[0] : null;
            return (
              <ChatListItem
                key={chat.id}
                username={otherUser.username}
                avatarUrl={otherUser.avatar_url}
                timestamp={formatRelativeDate(chat.updated_at, { short: true })}
                itemImage={itemImage}
                itemFormat={chat.listings?.format}
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
  width: 288px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-y: auto;

  @media (max-width: ${breakpoint.md}) {
    width: 100%;
    min-width: 0;
    max-height: none;
    flex: 1;
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const LoadingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xs']};
`;
