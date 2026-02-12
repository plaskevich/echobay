import { forwardRef } from 'react';
import styled from 'styled-components';

interface Message {
  id: string;
  sender_id: string;
  content: string;
}

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>(function MessagesList(
  { messages, currentUserId },
  ref
) {
  return (
    <MessagesArea>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} $isOwn={msg.sender_id === currentUserId}>
          <MessageContent>{msg.content}</MessageContent>
        </MessageBubble>
      ))}
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
