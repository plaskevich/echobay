import styled from 'styled-components';

interface StateDisplayProps {
  message: string;
  'data-testid'?: string;
}

export function LoadingState({ message = 'Loading...', ...rest }: Partial<StateDisplayProps>) {
  return <StateText {...rest}>{message}</StateText>;
}

export function EmptyState({ message, ...rest }: StateDisplayProps) {
  return <CenteredStateText {...rest}>{message}</CenteredStateText>;
}

export function ErrorState({ message, ...rest }: StateDisplayProps) {
  return <ErrorText {...rest}>{message}</ErrorText>;
}

const StateText = styled.p`
  color: ${(props) => props.theme.text.secondary};
  padding: 1.5rem;
  font-size: 0.95rem;
`;

const CenteredStateText = styled.p`
  color: ${(props) => props.theme.text.secondary};
  text-align: center;
  padding: 2rem;
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.state.error};
  text-align: center;
  padding: 2rem;
`;
