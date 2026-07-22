import { makeElevation, sharedTokens } from './tokens';
import type { ShadowColors, ThemeColors } from './types';

const lightShadow: ShadowColors = {
  small: 'rgba(0, 0, 0, 0.08)',
  medium: 'rgba(0, 0, 0, 0.12)',
  large: 'rgba(0, 0, 0, 0.16)',
};

export const lightTheme: ThemeColors = {
  background: {
    primary: '#F5F5F5',
    secondary: '#E7E7E7',
    tertiary: '#EEEEEE',
    primaryHover: '#F0F0F0',
    secondaryHover: '#DEDEDE',
  },
  text: {
    primary: '#0a0a0a',
    secondary: '#525252',
    tertiary: '#515151',
    muted: '#6b7280',
    accent: '#3E86F9',
  },
  border: {
    primary: '#B8B8B8',
    hover: '#d4d4d4',
  },
  primary: {
    main: '#3a86ff',
    hover: '#3272D8',
    light: '#DCE9FA',
  },
  state: {
    success: '#509109',
    warning: '#f59e0b',
    error: '#c91e28',
    info: '#0588f0',
  },
  status: {
    hidden: {
      background: '#737373',
      text: '#fafafa',
    },
    sold: {
      background: '#238166',
      text: '#E7FBF1',
    },
  },
  price: '#404040',
  favorite: 'rgb(247, 82, 107)',
  shadow: lightShadow,
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },
  spinner: {
    background: 'rgba(255, 255, 255, 0.3)',
    foreground: '#ffffff',
  },
  ...sharedTokens,
  elevation: makeElevation(lightShadow),
};
