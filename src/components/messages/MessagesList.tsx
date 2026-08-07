import { Fragment, forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';

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
      {messages.map((msg, idx) => {
        const msgDate = new Date(msg.created_at);
        const prev = messages[idx - 1];
        const next = messages[idx + 1];
        const prevDate = prev ? new Date(prev.created_at) : null;
        const nextDate = next ? new Date(next.created_at) : null;

        const isNewDay = !prevDate || !isSameDay(prevDate, msgDate);
        const isSystem = msg.type === 'system' && msg.metadata;
        const isOwn = msg.sender_id === currentUserId;
        const isLastInGroup = isSystem || isLastGroupMessage(msg, next, msgDate, nextDate);
        const timeLabel = formatTime(msgDate);
        const fullLabel = formatFullDateTime(msgDate);

        return (
          <Fragment key={msg.id}>
            {isNewDay && <DateDivider>{formatDateLabel(msgDate)}</DateDivider>}

            {isSystem ? (
              <SystemMessage
                metadata={msg.metadata!}
                isSeller={isSeller}
                isBuyer={isBuyer}
                orderStatus={orderStatus}
                sellerId={chatSellerId}
                onConfirmShipped={onConfirmShipped}
                onConfirmReceived={onConfirmReceived}
                isUpdating={isUpdatingOrder}
              />
            ) : (
              <MessageRow $isOwn={isOwn}>
                <MessageWrapper>
                  <MessageBubble
                    $isOwn={isOwn}
                    data-testid={isOwn ? 'message-bubble-own' : 'message-bubble-other'}
                    title={fullLabel}
                  >
                    <MessageContent data-testid="message-content">{msg.content}</MessageContent>
                  </MessageBubble>
                  {isLastInGroup && <Timestamp aria-label={fullLabel}>{timeLabel}</Timestamp>}
                </MessageWrapper>
              </MessageRow>
            )}
          </Fragment>
        );
      })}
      <div ref={ref} />
    </MessagesArea>
  );
});

const TEN_MINUTES_MS = 10 * 60 * 1000;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isWithinWindow = (a: Date, b: Date, windowMs: number) => Math.abs(a.getTime() - b.getTime()) < windowMs;

function isLastGroupMessage(current: Message, next: Message | undefined, currentDate: Date, nextDate: Date | null) {
  if (!next || !nextDate) return true;
  if (current.type !== 'text' || next.type !== 'text') return true;
  if (current.sender_id !== next.sender_id) return true;
  if (!isSameDay(currentDate, nextDate)) return true;
  return !isWithinWindow(currentDate, nextDate, TEN_MINUTES_MS);
}

function formatDateLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' }).format(date);
}

function formatFullDateTime(date: Date) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

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

const DateDivider = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.85rem;
  margin: 0.25rem 0;
  padding: 0.15rem 0.5rem;
`;

const messageIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageRow = styled.div<{ $isOwn: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  animation: ${messageIn} ${({ theme }) => theme.duration.base} ${({ theme }) => theme.easing.standard};
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 75%;
  width: fit-content;
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  align-self: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  padding: 0.5rem 0.9rem;
  background-color: ${({ theme, $isOwn }) => ($isOwn ? theme.primary.main : theme.background.secondary)};
  color: ${({ theme, $isOwn }) => ($isOwn ? 'white' : theme.text.primary)};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MessageContent = styled.div`
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.muted};
  align-self: flex-end;
`;
