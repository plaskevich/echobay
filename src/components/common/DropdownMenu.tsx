import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';

type DropdownAlign = 'left' | 'right';

type DropdownTriggerRenderProps = {
  isOpen: boolean;
  onClick: () => void;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
};

type DropdownContextValue = {
  close: () => void;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error('Dropdown menu components must be used within <Dropdown>.');
  }
  return ctx;
}

export interface DropdownProps {
  trigger: (props: DropdownTriggerRenderProps) => ReactNode;
  children: ReactNode;
  menuLabel: string;
  align?: DropdownAlign;
  minWidth?: string;
}

export function Dropdown({ trigger, children, menuLabel, align = 'right', minWidth = '12rem' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((open) => !open);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isOpen]);

  return (
    <DropdownRoot ref={rootRef}>
      {trigger({
        isOpen,
        onClick: toggle,
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': menuId,
      })}

      {isOpen ? (
        <DropdownContext.Provider value={{ close }}>
          <DropdownPanel id={menuId} role="menu" aria-label={menuLabel} $align={align} $minWidth={minWidth}>
            {children}
          </DropdownPanel>
        </DropdownContext.Provider>
      ) : null}
    </DropdownRoot>
  );
}

export type DropdownMenuLinkProps = LinkProps & {
  closeOnSelect?: boolean;
};

export function DropdownMenuLink({ closeOnSelect = true, onClick, ...props }: DropdownMenuLinkProps) {
  const { close } = useDropdownContext();

  return (
    <StyledDropdownLink
      {...props}
      role="menuitem"
      onClick={(event: ReactMouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented && closeOnSelect) close();
      }}
    />
  );
}

export type DropdownMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  closeOnSelect?: boolean;
  variant?: 'default' | 'danger';
};

export function DropdownMenuButton({
  closeOnSelect = true,
  variant = 'default',
  onClick,
  ...props
}: DropdownMenuButtonProps) {
  const { close } = useDropdownContext();

  return (
    <StyledDropdownButton
      {...props}
      $variant={variant}
      type={props.type ?? 'button'}
      role="menuitem"
      onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented && closeOnSelect) close();
      }}
    />
  );
}

export const DropdownMenuSeparator = styled.div`
  height: 1px;
  background: ${(props) => props.theme.border.primary};
`;

const DropdownRoot = styled.div`
  position: relative;
`;

const DropdownPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$align', '$minWidth'].includes(prop),
})<{ $align: DropdownAlign; $minWidth: string }>`
  position: absolute;
  top: calc(100% + 1rem);
  ${(p) => (p.$align === 'left' ? 'left: 0;' : 'right: 0;')}
  min-width: ${(p) => p.$minWidth};
  max-width: calc(100vw - 1rem);
  box-sizing: border-box;
  background: ${(props) => props.theme.background.primary};
  border: 1px solid ${(props) => props.theme.border.primary};
  box-shadow: ${(props) => props.theme.shadow};
  z-index: 100;
  @media (max-width: 640px) {
    top: calc(100% + 0.75rem);
  }
`;

const dropdownItemStyles = css`
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  color: ${(props) => props.theme.text.primary};
  text-decoration: none;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0.75rem;
  transition: all ${(props) => props.theme.transition.base};

  &:hover {
    color: ${(props) => props.theme.primary.main};
  }

  @media (max-width: 640px) {
    font-size: 1.125rem;
    margin: 1.25rem 1rem;
  }
`;

const StyledDropdownLink = styled(Link)`
  ${dropdownItemStyles}
`;

const StyledDropdownButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$variant',
})<{ $variant: 'default' | 'danger' }>`
  ${dropdownItemStyles}
  background: none;
  border: none;
  text-align: left;

  ${(p) =>
    p.$variant === 'danger' &&
    css`
      &:hover {
        color: ${(props) => props.theme.state.error};
      }
    `}
`;
