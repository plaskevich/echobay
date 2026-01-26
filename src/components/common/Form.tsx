import { type SelectHTMLAttributes } from 'react';
import { PiCaretDown } from 'react-icons/pi';
import styled from 'styled-components';

import { BaseInput, FormGroup as InputFormGroup, Label as InputLabel } from './Input';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <SelectWrapper>
      <StyledSelect {...props} />
      <SelectIcon />
    </SelectWrapper>
  );
}

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = InputFormGroup;
export const Label = InputLabel;
export const Input = BaseInput;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 0.75rem;
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary.light};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 0.75rem;
  font-size: 1rem;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.text.primary};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary.light};
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
  border-radius: 0.75rem;
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
    border-radius: 0.75rem;
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
`;

export const OptionalLabel = styled.span`
  color: ${(props) => props.theme.text.muted};
  font-weight: normal;
`;
