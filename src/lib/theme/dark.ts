import { makeElevation, sharedTokens } from './tokens';
import type { ShadowColors, ThemeColors } from './types';

const darkShadow: ShadowColors = {
  small: 'rgba(255, 255, 255, 0.1)',
  medium: 'rgba(255, 255, 255, 0.15)',
  large: 'rgba(255, 255, 255, 0.2)',
};

export const darkTheme: ThemeColors = {
  background: {
    primary: '#0a0a0a',
    secondary: '#161618',
    tertiary: '#111117',
    primaryHover: '#161616',
    secondaryHover: '#262626',
  },
  text: {
    primary: '#EFEFEF',
    secondary: '#a3a3a3',
    tertiary: '#61656F',
    muted: '#9ca3af',
    accent: '#6DA4FC',
  },
  border: {
    primary: '#4d515c',
    hover: '#404040',
  },
  primary: {
    main: '#3F79D7',
    hover: '#2D69CA',
    light: '#0A122B',
  },
  state: {
    success: '#5FCFAA',
    warning: '#fbbf24',
    error: '#C84B6C',
    info: '#8ec8f6',
  },
  status: {
    hidden: {
      background: '#404040',
      text: '#e5e5e5',
    },
    sold: {
      background: '#238166',
      text: '#E7FBF1',
    },
  },
  price: '#d4d4d4',
  favorite: '#EB567E',
  shadow: darkShadow,
  overlay: {
    dark: 'rgba(0, 0, 0, 0.7)',
    darker: 'rgba(0, 0, 0, 0.85)',
  },
  glass: {
    background: 'rgba(10, 10, 10, 0.94)',
    border: 'rgba(255, 255, 255, 0.08)',
  },
  spinner: {
    background: 'rgba(255, 255, 255, 0.2)',
    foreground: '#ffffff',
  },
  ...sharedTokens,
  elevation: makeElevation(darkShadow),
};
