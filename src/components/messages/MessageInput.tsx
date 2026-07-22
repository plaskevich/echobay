import { PiPaperPlaneRightDuotone } from 'react-icons/pi';
import styled from 'styled-components';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function MessageInput({ value, onChange, onSend, disabled }: MessageInputProps) {
  return (
    <MessageInputArea>
      <MessageInputWrapper>
        <MessageInputField
          placeholder="Write a message here"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={disabled}
          data-testid="message-input"
        />
        <MessageSendButton
          type="button"
          onClick={onSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
          data-testid="message-send-button"
        >
          <PiPaperPlaneRightDuotone size={20} />
        </MessageSendButton>
      </MessageInputWrapper>
    </MessageInputArea>
  );
}

const MessageInputArea = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid ${(props) => props.theme.border.primary};

  @media (max-width: 640px) {
    position: sticky;
    bottom: 0;
    z-index: 10;
    background-color: ${(props) => props.theme.background.primary};
    padding: 0.75rem 0.75rem max(0.75rem, env(safe-area-inset-bottom));
  }
`;

const MessageInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.primary.main};
  }
`;

const MessageInputField = styled.input`
  flex: 1;
  padding: 0.875rem 1rem 0.875rem 1.25rem;
  font-size: 1rem;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.text.primary};

  &::placeholder {
    color: ${(props) => props.theme.text.tertiary};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MessageSendButton = styled.button`
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.primary.hover};
  }

  &:disabled {
    opacity: 0.5;
    color: ${(props) => props.theme.text.tertiary};
    cursor: auto;
  }
`;
