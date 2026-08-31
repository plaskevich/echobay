import { css } from 'styled-components';

const DESKTOP_CHROME = '8rem';

/** Shared by the nav bar and the content below it, which must stay aligned. */
export const CONTENT_MAX_WIDTH = '1280px';

export const fullContentHeight = css`
  height: calc(100vh - ${DESKTOP_CHROME});
  height: calc(100dvh - ${DESKTOP_CHROME});
  min-height: 0;
`;

export const minFullContentHeight = css`
  min-height: calc(100vh - ${DESKTOP_CHROME});
  min-height: calc(100dvh - ${DESKTOP_CHROME});
`;
