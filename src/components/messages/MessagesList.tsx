import { forwardRef } from 'react';
import styled from 'styled-components';

import type { Message } from '@/api/messages';
import { SystemMessage } from '@/components/messages/system/SystemMessage';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
  chatBuyerId?: string;
  chatSellerId?: string;
  orderStatus?: string;
  onConfirmShipped?: (orderId: string) => void;
  onConfirmReceived?: (orderId: string) => void;
  isUpdatingOrder?: boolean;
}

export const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>(function MessagesList(
  {
    messages,
    currentUserId,
    chatBuyerId,
    chatSellerId,
    orderStatus,
    onConfirmShipped,
    onConfirmReceived,
    isUpdatingOrder,
  },
  ref
) {
  const isSeller = currentUserId === chatSellerId;
  const isBuyer = currentUserId === chatBuyerId;

  return (
    <MessagesArea data-testid="messages-list">
      {messages.map((msg) => {
        if (msg.type === 'system' && msg.metadata) {
          return (
            <SystemMessage
              key={msg.id}
              metadata={msg.metadata}
              isSeller={isSeller}
              isBuyer={isBuyer}
              orderStatus={orderStatus}
              sellerId={chatSellerId}
              onConfirmShipped={onConfirmShipped}
              onConfirmReceived={onConfirmReceived}
              isUpdating={isUpdatingOrder}
            />
          );
        }

        const isOwn = msg.sender_id === currentUserId;
        return (
          <MessageBubble
            key={msg.id}
            $isOwn={isOwn}
            data-testid={isOwn ? 'message-bubble-own' : 'message-bubble-other'}
          >
            <MessageContent data-testid="message-content">{msg.content}</MessageContent>
          </MessageBubble>
        );
      })}
      <div ref={ref} />
    </MessagesArea>
  );
});

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    overflow-y: visible;
  }
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  align-self: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  max-width: 75%;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme, $isOwn }) => ($isOwn ? theme.primary.main : theme.border.primary)};
  background-color: ${({ theme, $isOwn }) => ($isOwn ? theme.primary.main : theme.background.tertiary)};
  color: ${({ theme, $isOwn }) => ($isOwn ? 'white' : theme.text.primary)};
`;

const MessageContent = styled.div`
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
`;
