import { css } from 'styled-components';

export const signatureSurface = css`
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg}
    ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm};
`;
