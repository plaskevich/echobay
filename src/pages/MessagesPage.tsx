import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import type { ChatWithDetails } from '@/api/messages';
import { ChatListSidebar } from '@/components/messages/ChatListSidebar';
import { ConversationPanel } from '@/components/messages/ConversationPanel';
import { useListing } from '@/queries/useListings';
import {
  useChat,
  useChatByListing,
  useCreateChat,
  useMarkChatAsRead,
  useMessages,
  useProfilesMap,
  useSendMessage,
  useUnreadChats,
  useUserChats,
} from '@/queries/useMessages';
import { useAuthStore } from '@/store/auth-store';

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatIdParam = searchParams.get('chatId');
  const listingIdParam = searchParams.get('listingId');
  const user = useAuthStore((state) => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageDraft, setMessageDraft] = useState('');

  const { data: chats = [], isLoading: chatsLoading } = useUserChats();
  const { data: unreadChats } = useUnreadChats();
  const { data: listing } = useListing(listingIdParam || '');
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkChatAsRead();

  const sellerId = listing?.owner_id || '';

  const { data: existingChatByListing } = useChatByListing(
    listingIdParam && user ? user.id : undefined,
    sellerId || undefined,
    listingIdParam || undefined
  );

  const effectiveChatId =
    chatIdParam ||
    (existingChatByListing?.id as string | undefined) ||
    (listingIdParam && existingChatByListing ? existingChatByListing.id : undefined) ||
    chats[0]?.id;

  const { data: selectedChat } = useChat(effectiveChatId || undefined);
  const { data: messages = [] } = useMessages(effectiveChatId || undefined);

  const otherUserIds = [
    ...chats.map((c) => (c.buyer_id === user?.id ? c.seller_id : c.buyer_id)),
    ...(listing?.owner_id ? [listing.owner_id] : []),
  ];
  const { data: profilesMap } = useProfilesMap(otherUserIds);

  useEffect(() => {
    if (effectiveChatId && effectiveChatId !== chatIdParam) {
      setSearchParams({ chatId: effectiveChatId }, { replace: true });
    }
  }, [effectiveChatId, chatIdParam, setSearchParams]);

  useEffect(() => {
    if (effectiveChatId) {
      markAsRead.mutate(effectiveChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveChatId, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const getOtherUserInfo = useCallback(
    (chat: ChatWithDetails) => {
      const otherId = chat.buyer_id === user?.id ? chat.seller_id : chat.buyer_id;
      const isSeller = chat.seller_id === otherId;
      const profile = otherId ? profilesMap?.get(otherId) : undefined;
      return {
        username: profile?.username ?? (isSeller ? 'Seller' : 'Buyer'),
        avatar_url: profile?.avatar_url ?? null,
      };
    },
    [user?.id, profilesMap]
  );

  const handleSelectChat = useCallback((chatId: string) => setSearchParams({ chatId }), [setSearchParams]);

  const handleSendMessage = useCallback(() => {
    const content = messageDraft.trim();
    if (!content || !user) return;

    const chatId = effectiveChatId;

    if (!chatId && listingIdParam && listing?.owner_id) {
      createChatMutation.mutate(
        { buyerId: user.id, sellerId: listing.owner_id, listingId: listingIdParam },
        {
          onSuccess: (newChat) => {
            setSearchParams({ chatId: newChat.id });
            sendMessageMutation.mutate(
              { chatId: newChat.id, content },
              {
                onSuccess: () => setMessageDraft(''),
              }
            );
          },
        }
      );
      return;
    }

    if (chatId) {
      sendMessageMutation.mutate(
        { chatId, content },
        {
          onSuccess: () => setMessageDraft(''),
        }
      );
    }
  }, [
    messageDraft,
    user,
    effectiveChatId,
    listingIdParam,
    listing,
    createChatMutation,
    sendMessageMutation,
    setSearchParams,
  ]);

  if (!user) {
    return (
      <Container>
        <EmptyState>Please log in to view your messages</EmptyState>
      </Container>
    );
  }

  const displayListing = selectedChat?.listings ?? (listingIdParam && listing ? listing : null);
  const showConversation = effectiveChatId || (listingIdParam && listing);
  const isLoading = createChatMutation.isPending || sendMessageMutation.isPending;
  const pendingListingForSidebar = listingIdParam && listing && !existingChatByListing ? listing : null;

  return (
    <Container>
      <Header>
        <Title>Messages</Title>
      </Header>

      <Layout>
        <ChatListSidebar
          chats={chats}
          pendingListing={pendingListingForSidebar}
          effectiveChatId={effectiveChatId}
          profilesMap={profilesMap}
          unreadChats={unreadChats}
          isLoading={chatsLoading}
          onSelectChat={handleSelectChat}
          getOtherUserInfo={getOtherUserInfo}
        />

        <ConversationPanel
          displayListing={displayListing}
          messages={messages}
          currentUserId={user.id}
          messageDraft={messageDraft}
          onMessageDraftChange={setMessageDraft}
          onSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
          showConversation={!!showConversation}
          isLoading={isLoading}
        />
      </Layout>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;

const Layout = styled.div`
  display: flex;
  flex: 1;
  min-height: 400px;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EmptyState = styled.p`
  padding: 2rem;
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
`;
