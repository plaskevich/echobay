import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

interface SpinnerProps {
  size?: string;
  $color?: string;
}

export function Spinner({ size, $color }: SpinnerProps) {
  return <SpinnerIcon className="hn hn-spinner-third" $size={size} $color={$color} aria-hidden="true" />;
}

const SpinnerIcon = styled.i<{ $size?: string; $color?: string }>`
  display: inline-block;
  flex-shrink: 0;
  line-height: 1;
  font-size: ${({ $size, theme }) => $size ?? theme.fontSize.base};
  color: ${({ $color }) => $color ?? 'currentColor'};
  animation: ${spin} 0.8s steps(8) infinite;
`;
