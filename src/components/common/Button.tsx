import { type ButtonHTMLAttributes, forwardRef } from 'react';
import styled, { type RuleSet, css } from 'styled-components';

import { Spinner } from '@/components/common/Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline';
type ButtonSize = 'small' | 'medium';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const press = css`
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const variantStyles: Record<ButtonVariant, RuleSet> = {
  primary: css`
    background-color: ${({ theme }) => theme.black.main};
    color: ${({ theme }) => theme.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.black.light};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.primary};
    border: 1px solid ${({ theme }) => theme.border.primary};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.background.tertiary};
      border-color: ${({ theme }) => theme.border.hover};
    }

    ${press}
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.text.primary};
    border: 1px solid ${({ theme }) => theme.border.primary};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.border.hover};
    }

    ${press}
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.text.primary};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.background.secondary};
    }

    ${press}
  `,
  danger: css`
    background-color: ${({ theme }) => theme.state.error};
    color: ${({ theme }) => theme.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    ${press}
  `,
  'danger-outline': css`
    background-color: transparent;
    color: ${({ theme }) => theme.state.error};
    border: 1px solid ${({ theme }) => theme.state.error};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.state.error};
      color: ${({ theme }) => theme.text.inverse};
    }

    ${press}
  `,
};

const sizeStyles: Record<ButtonSize, RuleSet> = {
  small: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
    height: 2rem;
    gap: 0.3rem;
  `,
  medium: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.base};
    height: 2.75rem;
  `,
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['fullWidth', 'isLoading', 'variant', 'size'].includes(prop),
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
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

  ${({ variant = 'primary' }) => variantStyles[variant]}
  ${({ size = 'medium' }) => sizeStyles[size]}
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
