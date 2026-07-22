import { darkTheme } from './dark';
import { lightTheme } from './light';

export type {
  BorderRadius,
  Duration,
  Easing,
  Elevation,
  FontSize,
  FontWeight,
  LineHeight,
  ShadowColors,
  Spacing,
  Theme,
  ThemeColors,
  Transition,
} from './types';
export { makeElevation, sharedTokens } from './tokens';
export { lightTheme } from './light';
export { darkTheme } from './dark';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
