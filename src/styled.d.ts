import 'styled-components';

import type { ThemeColors } from './lib/theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeColors {}
}
