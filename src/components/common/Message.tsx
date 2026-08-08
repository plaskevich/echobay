import styled from 'styled-components';

export const ErrorMessage = styled.div`
  color: ${(props) => props.theme.state.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const WarningMessage = styled.div`
  color: ${(props) => props.theme.state.warning};
  padding: 1rem;
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.state.warning};
  margin-bottom: 1rem;
`;

export const InfoMessage = styled.div`
  color: ${(props) => props.theme.text.secondary};
  padding: 1rem;
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.border.primary};
  margin-bottom: 1rem;
`;
