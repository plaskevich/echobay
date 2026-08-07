export interface Spacing {
  '3xs': string;
  '2xs': string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface FontSize {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface FontWeight {
  regular: number;
  medium: number;
  semibold: number;
  bold: number;
}

export interface LineHeight {
  tight: number;
  snug: number;
  normal: number;
  relaxed: number;
}

export interface Duration {
  fast: string;
  base: string;
  slow: string;
}

export interface Easing {
  standard: string;
  emphasized: string;
}

export interface Transition {
  fast: string;
  base: string;
  slow: string;
}

export interface Elevation {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryHover: string;
    secondaryHover: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    accent: string;
  };
  border: {
    primary: string;
    hover: string;
  };
  black: {
    main: string;
    light: string;
  };
  primary: {
    main: string;
    hover: string;
    light: string;
  };
  state: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  price: string;
  favorite: string;
  shadow: {
    small: string;
    medium: string;
    large: string;
  };
  overlay: {
    dark: string;
    darker: string;
  };
  glass: {
    background: string;
    border: string;
  };
  spinner: {
    background: string;
    foreground: string;
  };
  spacing: Spacing;
  fontFamily: string;
  fontFamilyAlt: string;
  fontSize: FontSize;
  fontWeight: FontWeight;
  lineHeight: LineHeight;
  duration: Duration;
  easing: Easing;
  transition: Transition;
  elevation: Elevation;
}

export type ShadowColors = ThemeColors['shadow'];
