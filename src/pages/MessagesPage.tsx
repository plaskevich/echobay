import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import type { ChatWithDetails } from '@/api/messages';
import { sendMessage } from '@/api/messages';
import { PageTitle } from '@/components/common/PageTitle';
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
import { useOrderForChat, useUpdateOrderStatus } from '@/queries/useOrders';
import { useAuthStore } from '@/store/auth-store';

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatIdParam = searchParams.get('chatId');
  const listingIdParam = searchParams.get('listingId');
  const user = useAuthStore((state) => state.user)!;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageDraft, setMessageDraft] = useState('');

  const { data: chats = [], isLoading: chatsLoading } = useUserChats();
  const { data: unreadChats } = useUnreadChats();
  const { data: listing } = useListing(listingIdParam || '');
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkChatAsRead();
  const updateOrderStatus = useUpdateOrderStatus();

  const sellerId = listing?.owner_id || '';

  const { data: existingChatByListing } = useChatByListing(
    listingIdParam ? user.id : undefined,
    sellerId || undefined,
    listingIdParam || undefined
  );

  const effectiveChatId = chatIdParam || existingChatByListing?.id || (listingIdParam ? undefined : chats[0]?.id);

  const { data: selectedChat } = useChat(effectiveChatId || undefined);
  const { data: messages = [] } = useMessages(effectiveChatId || undefined);
  const { data: orderData } = useOrderForChat(selectedChat?.order_id);

  const otherUserIds = [
    ...chats.map((c) => (c.buyer_id === user.id ? c.seller_id : c.buyer_id)),
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
      const otherId = chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id;
      const isSeller = chat.seller_id === otherId;
      const profile = otherId ? profilesMap?.get(otherId) : undefined;
      return {
        username: profile?.username ?? (isSeller ? 'Seller' : 'Buyer'),
        avatar_url: profile?.avatar_url ?? null,
      };
    },
    [user.id, profilesMap]
  );

  const handleSelectChat = useCallback((chatId: string) => setSearchParams({ chatId }), [setSearchParams]);

  const handleSendMessage = useCallback(() => {
    const content = messageDraft.trim();
    if (!content) return;

    const chatId = effectiveChatId;

    if (!chatId && listingIdParam && listing?.owner_id) {
      createChatMutation.mutate(
        { buyerId: user.id, sellerId: listing.owner_id, listingId: listingIdParam },
        {
          onSuccess: (newChat) => {
            setSearchParams({ chatId: newChat.id }, { replace: true });
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
    user.id,
    effectiveChatId,
    listingIdParam,
    listing,
    createChatMutation,
    sendMessageMutation,
    setSearchParams,
  ]);

  const handleConfirmShipped = useCallback(
    (orderId: string) => {
      if (!effectiveChatId) return;
      updateOrderStatus.mutate(
        { orderId, status: 'shipped' },
        {
          onSuccess: () => {
            sendMessage(effectiveChatId, user.id, 'Item has been shipped', {
              type: 'system',
              metadata: {
                event: 'shipped',
                order_id: orderId,
                listing_title: selectedChat?.listings?.title,
              },
            });
          },
        }
      );
    },
    [effectiveChatId, user.id, selectedChat, updateOrderStatus]
  );

  const handleConfirmReceived = useCallback(
    (orderId: string) => {
      if (!effectiveChatId) return;
      updateOrderStatus.mutate(
        { orderId, status: 'delivered' },
        {
          onSuccess: () => {
            sendMessage(effectiveChatId, user.id, 'Item has been received', {
              type: 'system',
              metadata: {
                event: 'delivered',
                order_id: orderId,
                listing_title: selectedChat?.listings?.title,
              },
            });
          },
        }
      );
    },
    [effectiveChatId, user.id, selectedChat, updateOrderStatus]
  );

  const displayListing = selectedChat?.listings ?? (listingIdParam && listing ? listing : null);
  const showConversation = effectiveChatId || (listingIdParam && listing);
  const isLoading = createChatMutation.isPending || sendMessageMutation.isPending;
  const pendingListingForSidebar = listingIdParam && listing && !existingChatByListing ? listing : null;
  const otherUserInfo = selectedChat
    ? getOtherUserInfo(selectedChat)
    : pendingListingForSidebar && listing?.owner_id
      ? {
          username: profilesMap?.get(listing.owner_id)?.username ?? 'Seller',
          avatar_url: profilesMap?.get(listing.owner_id)?.avatar_url ?? null,
        }
      : undefined;

  const otherUsername = otherUserInfo?.username;

  const otherUserId = selectedChat
    ? selectedChat.buyer_id === user.id
      ? selectedChat.seller_id
      : selectedChat.buyer_id
    : pendingListingForSidebar
      ? listing?.owner_id
      : undefined;

  const otherAvatarUrl = otherUserInfo?.avatar_url ?? null;

  const [mobileShowConversation, setMobileShowConversation] = useState(!!showConversation);

  useEffect(() => {
    if (showConversation) {
      setMobileShowConversation(true);
    }
  }, [showConversation]);

  const handleSelectChatMobile = useCallback(
    (chatId: string) => {
      handleSelectChat(chatId);
      setMobileShowConversation(true);
    },
    [handleSelectChat]
  );

  const handleBackToChats = useCallback(() => {
    setMobileShowConversation(false);
  }, []);

  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth <= 768, []);

  return (
    <Container>
      <Header>
        <PageTitle>Messages</PageTitle>
      </Header>

      <Layout>
        <ChatListWrapper $mobileHidden={mobileShowConversation}>
          <ChatListSidebar
            chats={chats}
            pendingListing={pendingListingForSidebar}
            effectiveChatId={effectiveChatId}
            profilesMap={profilesMap}
            unreadChats={unreadChats}
            isLoading={chatsLoading}
            onSelectChat={isMobile ? handleSelectChatMobile : handleSelectChat}
            getOtherUserInfo={getOtherUserInfo}
          />
        </ChatListWrapper>

        <ConversationWrapper $mobileHidden={!mobileShowConversation}>
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
            onBack={handleBackToChats}
            otherUsername={otherUsername}
            otherUserId={otherUserId}
            otherAvatarUrl={otherAvatarUrl}
            chatBuyerId={selectedChat?.buyer_id ?? (pendingListingForSidebar ? user.id : undefined)}
            chatSellerId={selectedChat?.seller_id ?? (pendingListingForSidebar ? listing?.owner_id : undefined)}
            orderStatus={orderData?.status}
            onConfirmShipped={handleConfirmShipped}
            onConfirmReceived={handleConfirmReceived}
            isUpdatingOrder={updateOrderStatus.isPending}
          />
        </ConversationWrapper>
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

  @media (max-width: 768px) {
    min-height: 0;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem 1rem 0.75rem;
    margin: 0;
    border-bottom: 1px solid ${(props) => props.theme.border.primary};
  }
`;

const Layout = styled.div`
  display: flex;
  flex: 1;
  min-height: 400px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: ${(props) => props.theme.borderRadius.md};

  @media (max-width: 768px) {
    min-height: 0;
    flex: 1;
    width: 100%;
    overflow: visible;
    border: none;
    border-radius: 0;
  }
`;

const ChatListWrapper = styled.div<{ $mobileHidden: boolean }>`
  display: flex;

  @media (max-width: 768px) {
    ${({ $mobileHidden }) => $mobileHidden && 'display: none;'}
    flex: 1;
  }
`;

const ConversationWrapper = styled.div<{ $mobileHidden: boolean }>`
  display: flex;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    ${({ $mobileHidden }) => $mobileHidden && 'display: none;'}
  }
`;
