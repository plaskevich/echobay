import { sharedTokens } from './tokens';
import type { ThemeColors } from './types';

export const theme: ThemeColors = {
  background: {
    primary: '#F5F5F5',
    secondary: '#E7E7E7',
    tertiary: '#dddddd',
    elevated: '#ffffff',
  },
  text: {
    primary: '#0a0a0a',
    secondary: '#525252',
    tertiary: '#515151',
    muted: 'rgb(156, 156, 164)',
    inverse: '#ffffff',
  },
  border: {
    primary: '#c1c1c1',
    hover: '#0a0a0a',
  },
  primary: {
    main: '#00f',
  },
  state: {
    success: '#14be39',
    warning: '#f59e0b',
    error: '#D62828',
  },
  black: {
    main: '#0a0a0a',
    light: '#212121',
  },
  shadow: '0px 1px 4px rgba(0, 0, 0, 0.4)',
  overlay: {
    dark: 'rgba(0, 0, 0, 0.4)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },
  glass: {
    background: 'rgba(245, 245, 245, 0.94)',
  },
  ...sharedTokens,
};
