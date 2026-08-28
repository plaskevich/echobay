import styled from 'styled-components';

export const ErrorMessage = styled.div`
  color: ${(props) => props.theme.state.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing['2xs']};
`;

export const WarningMessage = styled.div`
  color: ${(props) => props.theme.state.warning};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.state.warning};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const InfoMessage = styled.div`
  color: ${(props) => props.theme.text.secondary};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${(props) => props.theme.background.secondary};
  border: 1px solid ${(props) => props.theme.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
