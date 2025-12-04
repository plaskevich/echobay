export type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: {
    primary: string;
    hover: string;
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
  shadow: {
    small: string;
    medium: string;
    large: string;
  };
}

export const lightTheme: ThemeColors = {
  background: {
    primary: '#fafafa',
    secondary: '#f5f5f5',
    tertiary: '#e5e5e5',
  },
  text: {
    primary: '#0a0a0a',
    secondary: '#525252',
    tertiary: '#737373',
  },
  border: {
    primary: '#e5e5e5',
    hover: '#d4d4d4',
  },
  primary: {
    main: '#7678ed',
    hover: '#5f61d9',
    light: '#ededfd',
  },
  state: {
    success: '#16a34a',
    warning: '#ea580c',
    error: '#dc2626',
    info: '#0891b2',
  },
  shadow: {
    small: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    large: 'rgba(0, 0, 0, 0.16)',
  },
};

export const darkTheme: ThemeColors = {
  background: {
    primary: '#0a0a0a',
    secondary: '#141414',
    tertiary: '#1f1f1f',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a3a3a3',
    tertiary: '#737373',
  },
  border: {
    primary: '#262626',
    hover: '#404040',
  },
  primary: {
    main: '#9799f5',
    hover: '#7678ed',
    light: '#1e1f4d',
  },
  state: {
    success: '#22c55e',
    warning: '#f97316',
    error: '#ef4444',
    info: '#06b6d4',
  },
  shadow: {
    small: 'rgba(0, 0, 0, 0.5)',
    medium: 'rgba(0, 0, 0, 0.6)',
    large: 'rgba(0, 0, 0, 0.7)',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
