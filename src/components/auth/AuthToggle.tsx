import styled from 'styled-components';

interface AuthToggleProps {
  mode: 'login' | 'signup';
  onToggle: () => void;
}

export function AuthToggle({ mode, onToggle }: AuthToggleProps) {
  return (
    <ToggleText>
      {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
      <ToggleButton type="button" onClick={onToggle} data-testid="auth-toggle-button">
        {mode === 'login' ? 'Register' : 'Log In'}
      </ToggleButton>
    </ToggleText>
  );
}

const ToggleText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary.main};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: 0;
  margin-left: ${({ theme }) => theme.spacing['2xs']};

  &:hover {
    text-decoration: underline;
  }
`;
