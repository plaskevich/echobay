import styled from 'styled-components';

import { ConversationHeader } from '@/components/messages/ConversationHeader';
import { MessageInput } from '@/components/messages/MessageInput';
import { MessagesList } from '@/components/messages/MessagesList';

interface ListingDisplay {
  id: string;
  title: string;
  artist: string;
  format?: string | null;
  price: number;
  images?: string[] | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
}

interface ConversationPanelProps {
  displayListing: ListingDisplay | null;
  messages: Message[];
  currentUserId: string;
  messageDraft: string;
  onMessageDraftChange: (value: string) => void;
  onSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  showConversation: boolean;
  isLoading: boolean;
}

export function ConversationPanel({
  displayListing,
  messages,
  currentUserId,
  messageDraft,
  onMessageDraftChange,
  onSendMessage,
  messagesEndRef,
  showConversation,
  isLoading,
}: ConversationPanelProps) {
  return (
    <Panel $hidden={!showConversation}>
      {showConversation && displayListing ? (
        <>
          <ConversationHeader
            listingId={displayListing.id}
            title={displayListing.title}
            artist={displayListing.artist}
            format={displayListing.format}
            price={displayListing.price}
            images={displayListing.images}
          />
          <MessagesList ref={messagesEndRef} messages={messages} currentUserId={currentUserId} />
          <MessageInput
            value={messageDraft}
            onChange={onMessageDraftChange}
            onSend={onSendMessage}
            disabled={isLoading}
          />
        </>
      ) : (
        <EmptyConversation>
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

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const EmptyConversation = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const EmptyConversationText = styled.p`
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
`;
