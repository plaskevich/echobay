import { type SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';

import { BaseInput, FormGroup as InputFormGroup, Label as InputLabel } from './Input';

interface SelectComponentProps extends SelectHTMLAttributes<HTMLSelectElement> {
  $hasError?: boolean;
}

export function Select({ $hasError, ...props }: SelectComponentProps) {
  return (
    <SelectWrapper>
      <StyledSelect $hasError={$hasError} {...props} />
      <SelectIcon className="hn hn-chevron-down" aria-hidden />
    </SelectWrapper>
  );
}

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const FormGroup = InputFormGroup;
export const Label = InputLabel;
export const Input = BaseInput;

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: ${breakpoint.md}) {
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const StyledSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  font-size: ${({ theme }) => theme.fontSize.base};
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.hover)};
    background-color: ${(props) => props.theme.background.elevated};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px ${(props) => props.theme.background.primary} inset;
    -webkit-text-fill-color: ${(props) => props.theme.text.primary};
    caret-color: ${(props) => props.theme.text.primary};
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const SelectIcon = styled.i`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  pointer-events: none;
  color: ${(props) => props.theme.text.secondary};
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  font-size: ${({ theme }) => theme.fontSize.base};
  background-color: transparent;
  color: ${(props) => props.theme.text.primary};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.hover)};
    background-color: ${(props) => props.theme.background.elevated};
  }

  &::placeholder {
    color: ${(props) => props.theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FileInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.border.primary};
  font-size: ${({ theme }) => theme.fontSize.base};
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.border.hover};
  }

  &::file-selector-button {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    margin-right: ${({ theme }) => theme.spacing.md};
    border: none;
    background-color: ${(props) => props.theme.black.main};
    color: ${(props) => props.theme.text.inverse};
    cursor: pointer;
    font-weight: ${({ theme }) => theme.fontWeight.medium};

    &:hover {
      background-color: ${(props) => props.theme.black.light};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &::file-selector-button {
      cursor: not-allowed;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;

  @media (max-width: ${breakpoint.sm}) {
    width: 100%;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;

    button {
      flex: 1 1 0;
      min-width: 0;
      width: auto;
    }
  }
`;

export const FieldWrapper = styled.div`
  position: relative;
`;

export const FieldError = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.state.error};
`;

export const HelpText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: ${({ theme }) => theme.spacing['2xs']};
`;
