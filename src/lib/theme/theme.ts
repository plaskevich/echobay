import { sharedTokens } from './tokens';
import type { ThemeColors } from './types';

export const theme: ThemeColors = {
  background: {
    primary: '#F5F5F5',
    secondary: '#E7E7E7',
    tertiary: '#dddddd',
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
    primary: '#c1c1c1',
    hover: '#0a0a0a',
  },
  primary: {
    main: '#00f',
    hover: 'rgb(49, 49, 250)',
    light: 'rgb(236, 236, 255)',
  },
  state: {
    success: '#14be39',
    warning: '#f59e0b',
    error: '#D62828',
    info: '#0588f0',
  },
  black: {
    main: '#0a0a0a',
    light: '#212121',
  },
  price: '#404040',
  favorite: '#D62828',
  shadow: '0px 1px 4px rgba(0, 0, 0, 0.4)',
  overlay: {
    dark: 'rgba(0, 0, 0, 0.4)',
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
};
