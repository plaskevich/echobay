import { css } from 'styled-components';

export const DESKTOP_CHROME = '8rem';

export const fullContentHeight = css`
  height: calc(100vh - ${DESKTOP_CHROME});
  height: calc(100dvh - ${DESKTOP_CHROME});
  min-height: 0;
`;

export const minFullContentHeight = css`
  min-height: calc(100vh - ${DESKTOP_CHROME});
  min-height: calc(100dvh - ${DESKTOP_CHROME});
`;
