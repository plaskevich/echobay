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
  gap: 0.2rem;
`;

const Label = styled.label<{ $required?: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};

  ${({ $required, theme }) =>
    $required &&
    `
    &::after {
      content: '*';
      color: ${theme.primary.main};
    }
  `}
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  line-height: 1.25;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.primary)};
  background-color: transparent;
  color: ${({ theme }) => theme.text.primary};
  transition: all ${({ theme }) => theme.transition.base};

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.state.error : theme.border.hover)};
    background-color: ${({ theme }) => theme.background.elevated};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &[type='number'] {
    appearance: textfield;
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
