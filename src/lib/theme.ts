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
    muted: string;
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
  price: string;
  shadow: {
    small: string;
    medium: string;
    large: string;
  };
  overlay: {
    dark: string;
    darker: string;
  };
  spinner: {
    background: string;
    foreground: string;
  };
}

export const lightTheme: ThemeColors = {
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
  },
  text: {
    primary: '#0a0a0a',
    secondary: '#525252',
    tertiary: '#737373',
    muted: '#6b7280',
  },
  border: {
    primary: '#e5e5e5',
    hover: '#d4d4d4',
  },
  primary: {
    main: '#0588f0',
    hover: '#0d74ce',
    light: '#E3F2FD',
  },
  state: {
    success: '#509109',
    warning: '#f59e0b',
    error: '#c91e28',
    info: '#0588f0',
  },
  price: '#16a34a',
  shadow: {
    small: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    large: 'rgba(0, 0, 0, 0.16)',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },
  spinner: {
    background: 'rgba(255, 255, 255, 0.3)',
    foreground: '#ffffff',
  },
};

export const darkTheme: ThemeColors = {
  background: {
    primary: '#0a0a0a',
    secondary: '#141414',
    tertiary: '#1a1a2e',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a3a3a3',
    tertiary: '#4d515c',
    muted: '#9ca3af',
  },
  border: {
    primary: '#4d515c',
    hover: '#404040',
  },
  primary: {
    main: '#0588f0',
    hover: '#0d74ce',
    light: '#16213e',
  },
  state: {
    success: '#8bd0b9',
    warning: '#fbbf24',
    error: '#e2839d',
    info: '#8ec8f6',
  },
  price: '#4ade80',
  shadow: {
    small: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    large: 'rgba(255, 255, 255, 0.2)',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.7)',
    darker: 'rgba(0, 0, 0, 0.85)',
  },
  spinner: {
    background: 'rgba(255, 255, 255, 0.2)',
    foreground: '#ffffff',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
