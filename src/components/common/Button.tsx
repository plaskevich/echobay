import { type ButtonHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.primary.main};
        color: white;
        border: none;

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.primary.hover};
        }

        &:active:not(:disabled) {
          transform: translateY(1px);
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.background.secondary};
        color: ${({ theme }) => theme.text.primary};
        border: 1px solid ${({ theme }) => theme.border.primary};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.background.tertiary};
          border-color: ${({ theme }) => theme.border.hover};
        }

        &:active:not(:disabled) {
          transform: translateY(1px);
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.primary.main};
        border: 2px solid ${({ theme }) => theme.primary.main};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.primary.light};
        }

        &:active:not(:disabled) {
          transform: translateY(1px);
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.text.primary};
        border: none;

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.background.secondary};
        }

        &:active:not(:disabled) {
          transform: translateY(1px);
        }
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.state.error};
        color: white;
        border: none;

        &:hover:not(:disabled) {
          opacity: 0.9;
        }

        &:active:not(:disabled) {
          transform: translateY(1px);
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        height: 2rem;
      `;
    case 'medium':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        height: 2.75rem;
      `;
    case 'large':
      return css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
        height: 3.5rem;
      `;
    default:
      return '';
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
  user-select: none;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary.main};
    outline-offset: 2px;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: wait;
      opacity: 0.7;
    `}
`;

const Spinner = styled.span`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, isLoading, disabled, ...props }, ref) => {
  return (
    <StyledButton ref={ref} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner />}
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';
