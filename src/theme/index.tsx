// ===== Theme Context & Hook =====
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { spacing, borderRadius, concentricRadius, springCurves } from './spacing';
import { typography } from './typography';
import { ThemeTransitionOverlay } from './ThemeTransitionOverlay';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('expense_tracker_theme_mode');
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          return saved;
        }
      } catch {}
    }
    return 'system';
  });

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('expense_tracker_theme_mode', mode);
      } catch {}
    }
  }, []);

  const isDark = themeMode === 'system'
    ? systemScheme === 'dark'
    : themeMode === 'dark';

  const theme: Theme = useMemo(() => ({
    colors: isDark ? darkColors : lightColors,
    spacing,
    borderRadius,
    typography,
    isDark,
  }), [isDark]);

  const value = useMemo(() => ({
    theme,
    themeMode,
    setThemeMode,
  }), [theme, themeMode, setThemeMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <ThemeTransitionOverlay />
    </ThemeContext.Provider>
  );
}

export { lightColors, darkColors, spacing, borderRadius, concentricRadius, springCurves, typography, ThemeTransitionOverlay };
export type { ThemeColors };


