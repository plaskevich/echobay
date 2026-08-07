import type {
  Duration,
  Easing,
  Elevation,
  FontSize,
  FontWeight,
  LineHeight,
  ShadowColors,
  Spacing,
  Transition,
} from './types';

const spacing: Spacing = {
  '3xs': '0.125rem',
  '2xs': '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

const fontFamily = "'Archivo Variable', system-ui, Avenir, Helvetica, Arial, sans-serif";

const fontSize: FontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
};

const fontWeight: FontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const lineHeight: LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.6,
};

const easing: Easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
};

const duration: Duration = {
  fast: '120ms',
  base: '180ms',
  slow: '280ms',
};

const transition: Transition = {
  fast: `${duration.fast} ${easing.standard}`,
  base: `${duration.base} ${easing.standard}`,
  slow: `${duration.slow} ${easing.standard}`,
};

export const sharedTokens = {
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  duration,
  easing,
  transition,
};

export const makeElevation = (shadow: ShadowColors): Elevation => ({
  sm: `0 1px 2px ${shadow.small}`,
  md: `0 4px 6px -1px ${shadow.medium}`,
  lg: `0 10px 25px -5px ${shadow.large}`,
  xl: `0 20px 40px -12px ${shadow.large}`,
});
