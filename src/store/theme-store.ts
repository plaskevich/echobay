import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Theme, ThemeColors } from '@/lib/theme';
import { darkTheme, lightTheme } from '@/lib/theme';

interface ThemeState {
  theme: Theme;
  themeColors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      themeColors: getSystemTheme() === 'light' ? lightTheme : darkTheme,
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        const newThemeColors = newTheme === 'light' ? lightTheme : darkTheme;
        document.documentElement.setAttribute('data-theme', newTheme);

        set({
          theme: newTheme,
          themeColors: newThemeColors,
        });
      },
      setTheme: (newTheme: Theme) => {
        const newThemeColors = newTheme === 'light' ? lightTheme : darkTheme;
        document.documentElement.setAttribute('data-theme', newTheme);

        set({
          theme: newTheme,
          themeColors: newThemeColors,
        });
      },
    }),
    {
      name: 'echobay-theme',
      partialize: (state) => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.themeColors = state.theme === 'light' ? lightTheme : darkTheme;
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
