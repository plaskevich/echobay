import styled from 'styled-components';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, ...props }: InputFieldProps) {
  if (label) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <FormGroup>
        <Label htmlFor={inputId}>{label}</Label>
        <StyledInput id={inputId} {...props} />
      </FormGroup>
    );
  }

  return <StyledInput id={id} {...props} />;
}

export { FormGroup, Label, StyledInput as BaseInput };

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary.light};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
