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

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
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
  };
  state: {
    success: string;
    warning: string;
    error: string;
  };
  shadow: string;
  overlay: {
    dark: string;
    darker: string;
  };
  glass: {
    background: string;
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
}
