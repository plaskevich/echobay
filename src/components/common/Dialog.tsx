import styled from 'styled-components';

import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: DialogProps) {
  if (!isOpen) return null;

  const confirmButtonVariant = variant === 'destructive' ? 'danger' : 'primary';

  return (
    <Overlay onClick={onClose}>
      <DialogContainer onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogMessage>{message}</DialogMessage>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onClose} type="button" variant="secondary">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} type="button" variant={confirmButtonVariant}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background-color: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow:
    0 25px 50px -12px ${(props) => props.theme.shadow.large},
    0 15px 30px -15px ${(props) => props.theme.shadow.large};
  max-width: 28rem;
  width: 90%;
  overflow: hidden;
`;

const DialogHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
`;

const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;

const DialogBody = styled.div`
  padding: 1.5rem;
`;

const DialogMessage = styled.p`
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const DialogFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;
