import styled from 'styled-components';

interface AuthToggleProps {
  mode: 'login' | 'signup';
  onToggle: () => void;
}

export function AuthToggle({ mode, onToggle }: AuthToggleProps) {
  return (
    <ToggleText>
      {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
      <ToggleButton type="button" onClick={onToggle}>
        {mode === 'login' ? 'Sign Up' : 'Log In'}
      </ToggleButton>
    </ToggleText>
  );
}

const ToggleText = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary.main};
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;
