import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Theme, ThemeColors } from '@/lib/theme';
import { darkTheme, lightTheme } from '@/lib/theme';

const updateMetaThemeColor = (color: string) => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', color);
  }
};

interface ThemeState {
  theme: Theme;
  themeColors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'echobay-theme';

const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.theme) return parsed.state.theme;
  }
  return getSystemTheme();
};

const applyTheme = (theme: Theme) => {
  const colors = theme === 'light' ? lightTheme : darkTheme;
  document.documentElement.setAttribute('data-theme', theme);
  updateMetaThemeColor(colors.background.primary);
  return colors;
};

const initialTheme = getInitialTheme();

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: initialTheme,
      themeColors: initialTheme === 'light' ? lightTheme : darkTheme,
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        const newThemeColors = applyTheme(newTheme);
        set({ theme: newTheme, themeColors: newThemeColors });
      },
      setTheme: (newTheme: Theme) => {
        const newThemeColors = applyTheme(newTheme);
        set({ theme: newTheme, themeColors: newThemeColors });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.themeColors = applyTheme(state.theme);
        }
      },
    }
  )
);
