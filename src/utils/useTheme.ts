import { createContext, useContext } from 'react';

export interface ThemeContextState {
  isDark: boolean;
  inverse(): void;
}

export const ThemeContext = createContext<ThemeContextState>({
  isDark: false,
} as ThemeContextState);

export function useTheme(): ThemeContextState {
  return useContext(ThemeContext);
}
