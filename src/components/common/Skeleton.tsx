import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
}

export const Skeleton = styled.div<SkeletonProps>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '1rem'};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.background.secondary} 25%,
    ${({ theme }) => theme.background.tertiary} 37%,
    ${({ theme }) => theme.background.secondary} 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;
