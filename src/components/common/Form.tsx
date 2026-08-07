import { type SelectHTMLAttributes } from 'react';
import { PiCaretDown } from 'react-icons/pi';
import styled from 'styled-components';

import { BaseInput, FormGroup as InputFormGroup, Label as InputLabel } from './Input';

interface SelectComponentProps extends SelectHTMLAttributes<HTMLSelectElement> {
  $hasError?: boolean;
}

export function Select({ $hasError, ...props }: SelectComponentProps) {
  return (
    <SelectWrapper>
      <StyledSelect $hasError={$hasError} {...props} />
      <SelectIcon />
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

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const StyledSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 1rem 2.5rem 1rem 1rem;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.primary.main)};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => ($hasError ? `${theme.state.error}30` : theme.primary.light)};
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

const SelectIcon = styled(PiCaretDown)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${(props) => props.theme.text.secondary};
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.primary.main)};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => ($hasError ? `${theme.state.error}30` : theme.primary.light)};
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
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary.light};
  }

  &::file-selector-button {
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    border: none;
    background-color: ${(props) => props.theme.primary.main};
    color: white;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background-color: ${(props) => props.theme.primary.hover};
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
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
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
  font-size: 0.75rem;
  color: ${({ theme }) => theme.state.error};
`;

export const HelpText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 0.25rem;
`;
