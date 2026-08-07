import { type ButtonHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

import { Spinner } from '@/components/common/Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline';
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
        background-color: ${({ theme }) => theme.black.main};
        color: white;
        border: none;

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.black.light};
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
        color: ${({ theme }) => theme.text.primary};
        border: 1px solid ${({ theme }) => theme.border.primary};

        &:hover:not(:disabled) {
          border-color: ${({ theme }) => theme.border.hover};
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
    case 'danger-outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.state.error};
        border: 1px solid ${({ theme }) => theme.state.error};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.state.error};
          color: white;
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
        gap: 0.3rem;
      `;
    case 'medium':
      return css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
        height: 2.75rem;
      `;
    case 'large':
      return css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
        height: 3.5rem;
        @media (max-width: 640px) {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          height: 3rem;
        }
      `;
    default:
      return '';
  }
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['fullWidth', 'isLoading', 'variant', 'size'].includes(prop),
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition:
    background-color ${({ theme }) => theme.transition.base},
    border-color ${({ theme }) => theme.transition.base},
    color ${({ theme }) => theme.transition.base},
    transform ${({ theme }) => theme.transition.fast},
    opacity ${({ theme }) => theme.transition.base};
  font-family: inherit;
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
  min-width: 0;

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
    outline: 1px solid ${({ theme }) => theme.primary.main};
    outline-offset: 2px;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: wait;
      opacity: 0.7;
    `}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, disabled, variant, size, fullWidth, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        disabled={disabled || isLoading}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
