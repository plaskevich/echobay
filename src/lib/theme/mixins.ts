import { css } from 'styled-components';

export const signatureSurface = css`
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg}
    ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm};
`;

export const glassSurface = css`
  background-color: ${({ theme }) => theme.glass.background};
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: ${({ theme }) => theme.background.primary};
  }
`;
