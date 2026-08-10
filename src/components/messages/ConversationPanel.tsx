import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { ListingSummary, Message } from '@/api/messages';
import type { OrderStatus } from '@/api/orders';
import { LoadingState } from '@/components/common/StateDisplay';
import { ConversationHeader } from '@/components/messages/ConversationHeader';
import { MessageInput } from '@/components/messages/MessageInput';
import { MessagesList } from '@/components/messages/MessagesList';

interface ConversationParticipants {
  currentUserId: string;
  otherUsername?: string;
  otherUserId?: string;
  otherAvatarUrl?: string | null;
  chatBuyerId?: string;
  chatSellerId?: string;
}

interface ConversationState {
  messages: Message[];
  messageDraft: string;
  showConversation: boolean;
  isLoading: boolean;
  isConversationLoading?: boolean;
  orderStatus?: OrderStatus;
  isUpdatingOrder?: boolean;
}

interface ConversationActions {
  onMessageDraftChange: (value: string) => void;
  onSendMessage: () => void;
  onBack?: () => void;
  onConfirmShipped?: (orderId: string) => void;
  onConfirmReceived?: (orderId: string) => void;
}

interface ConversationPanelProps {
  listing: ListingSummary | null;
  participants: ConversationParticipants;
  conversationState: ConversationState;
  actions: ConversationActions;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ConversationPanel({
  listing,
  participants,
  conversationState,
  actions,
  messagesEndRef,
}: ConversationPanelProps) {
  const { currentUserId, otherUsername, otherUserId, otherAvatarUrl, chatBuyerId, chatSellerId } = participants;

  const { messages, messageDraft, showConversation, isLoading, isConversationLoading, orderStatus, isUpdatingOrder } =
    conversationState;

  const { onMessageDraftChange, onSendMessage, onBack, onConfirmShipped, onConfirmReceived } = actions;

  return (
    <Panel $hidden={!showConversation} data-testid="conversation-panel">
      {showConversation && listing ? (
        <>
          {onBack && (
            <MobileHeader>
              <BackButton onClick={onBack} data-testid="conversation-back-button">
                <i className="hn hn-angle-left" aria-hidden />
              </BackButton>
              {otherUsername && otherUserId ? (
                <MobileUsernameLink to={`/users/${otherUserId}`}>{otherUsername}</MobileUsernameLink>
              ) : otherUsername ? (
                <MobileUsername>{otherUsername}</MobileUsername>
              ) : null}
              <Spacer />
            </MobileHeader>
          )}
          <ConversationHeader
            listingId={listing.id}
            title={listing.title}
            artist={listing.artist}
            format={listing.format}
            price={listing.price}
            images={listing.images}
            listingStatus={listing.status}
            isBuyer={chatBuyerId === currentUserId}
            hasOrder={!!orderStatus}
            otherUserId={otherUserId}
            otherUsername={otherUsername}
            otherAvatarUrl={otherAvatarUrl}
          />
          <MessagesList
            ref={messagesEndRef}
            messages={messages}
            currentUserId={currentUserId}
            chatBuyerId={chatBuyerId}
            chatSellerId={chatSellerId}
            orderStatus={orderStatus}
            onConfirmShipped={onConfirmShipped}
            onConfirmReceived={onConfirmReceived}
            isUpdatingOrder={isUpdatingOrder}
          />
          <MessageInput
            value={messageDraft}
            onChange={onMessageDraftChange}
            onSend={onSendMessage}
            disabled={isLoading}
          />
        </>
      ) : isConversationLoading ? (
        <LoadingState message="Loading conversation" data-testid="conversation-loading" />
      ) : (
        <EmptyConversation data-testid="conversation-empty">
          <EmptyConversationIcon className="hn hn-comments" aria-hidden />
          <EmptyConversationText>Select a conversation or contact a seller from a listing</EmptyConversationText>
        </EmptyConversation>
      )}
    </Panel>
  );
}

const Panel = styled.div<{ $hidden?: boolean }>`
  flex: 1;
  display: ${({ $hidden }) => ($hidden ? 'none' : 'flex')};
  flex-direction: column;
  min-width: 0;
  padding: 0 2rem;
  max-width: 800px;
  margin: 0 auto;
  margin-top: -1rem;
  @media (max-width: 768px) {
    min-height: 0;
    overflow: visible;
    border: none;
    margin-top: 0;
    padding: 0 1rem;
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: ${(props) => props.theme.text.primary};
  font-size: 1.25rem;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  width: 1.5rem;
`;

const MobileUsername = styled.span`
  flex: 1;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MobileUsernameLink = styled(Link)`
  flex: 1;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Spacer = styled.div`
  width: 1.5rem;
  flex-shrink: 0;
`;

const EmptyConversation = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: ${(props) => props.theme.text.tertiary};
`;

const EmptyConversationIcon = styled.i`
  font-size: 3rem;
  color: ${(props) => props.theme.text.primary};
`;

const EmptyConversationText = styled.p`
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
  margin: 0;
  max-width: 22rem;
`;
