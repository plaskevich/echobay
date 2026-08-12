import { css } from 'styled-components';

export const ellipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const glassSurface = css`
  background-color: ${({ theme }) => theme.glass.background};
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: ${({ theme }) => theme.background.primary};
  }
`;
