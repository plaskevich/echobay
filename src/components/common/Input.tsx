import styled from 'styled-components';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  $hasError?: boolean;
}

export function Input({ label, id, $hasError, ...props }: InputFieldProps) {
  if (label) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <FormGroup>
        <Label htmlFor={inputId}>{label}</Label>
        <StyledInput id={inputId} $hasError={$hasError} {...props} />
      </FormGroup>
    );
  }

  return <StyledInput id={id} $hasError={$hasError} {...props} />;
}

export { FormGroup, Label, StyledInput as BaseInput };

const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.primary.main)};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => ($hasError ? `${theme.state.error}30` : theme.primary.light)};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px ${({ theme }) => theme.background.primary} inset;
    -webkit-text-fill-color: ${({ theme }) => theme.text.primary};
    caret-color: ${({ theme }) => theme.text.primary};
    transition: background-color 5000s ease-in-out 0s;
  }
`;
