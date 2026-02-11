export type Theme = 'light' | 'dark';

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
  status: {
    hidden: {
      background: string;
      text: string;
    };
    sold: {
      background: string;
      text: string;
    };
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
  spinner: {
    background: string;
    foreground: string;
  };
}

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
  },
  border: {
    primary: '#D0D0D0',
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
    secondary: '#1B1B1B',
    tertiary: '#111117',
    primaryHover: '#161616',
    secondaryHover: '#262626',
  },
  text: {
    primary: '#EFEFEF',
    secondary: '#a3a3a3',
    tertiary: '#61656F',
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
