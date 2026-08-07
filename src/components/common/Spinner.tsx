import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

interface SpinnerProps {
  size?: string;
  thickness?: string;
  $trackColor?: string;
  $color?: string;
}

export const Spinner = styled.span<SpinnerProps>`
  display: inline-block;
  flex-shrink: 0;
  width: ${({ size }) => size ?? '1rem'};
  height: ${({ size }) => size ?? '1rem'};
  border: ${({ thickness }) => thickness ?? '2px'} solid
    ${({ theme, $trackColor }) => $trackColor ?? theme.spinner.background};
  border-top-color: ${({ theme, $color }) => $color ?? theme.spinner.foreground};
  animation: ${spin} 0.6s linear infinite;
`;
