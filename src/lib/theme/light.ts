import { makeElevation, sharedTokens } from './tokens';
import type { ShadowColors, ThemeColors } from './types';

const lightShadow: ShadowColors = {
  small: 'rgba(0, 0, 0, 1)',
  medium: 'rgba(0, 0, 0, 0.12)',
  large: 'rgba(0, 0, 0, 0.16)',
};

export const lightTheme: ThemeColors = {
  background: {
    primary: '#F5F5F5',
    secondary: '#E7E7E7',
    tertiary: 'rgb(236, 236, 236)',
    primaryHover: '#F0F0F0',
    secondaryHover: '#DEDEDE',
  },
  text: {
    primary: '#0a0a0a',
    secondary: '#525252',
    tertiary: '#515151',
    muted: 'rgb(156, 156, 164)',
    accent: '#00f',
  },
  border: {
    primary: '#B8B8B8',
    hover: '#d4d4d4',
  },
  primary: {
    main: '#00f',
    hover: 'rgb(49, 49, 250)',
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
  black: {
    main: '#000000',
    light: '#212121',
  },
  price: '#404040',
  favorite: 'rgb(247, 82, 107)',
  shadow: lightShadow,
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },
  glass: {
    background: 'rgba(245, 245, 245, 0.94)',
    border: 'rgba(0, 0, 0, 0.06)',
  },
  spinner: {
    background: 'rgba(255, 255, 255, 0.3)',
    foreground: '#ffffff',
  },
  ...sharedTokens,
  elevation: makeElevation(lightShadow),
};
