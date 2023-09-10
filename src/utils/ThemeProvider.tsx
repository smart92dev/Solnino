import { FC, useCallback, useState, ReactNode } from 'react';

import { ThemeContext } from './useTheme';

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const prevUserTheme = localStorage.getItem('DarkTheme');
  const [isDark, setIsDark] = useState<boolean>(
    prevUserTheme == null ||
      prevUserTheme === undefined ||
      prevUserTheme === 'false'
      ? false
      : true,
  );

  const inverse = useCallback(() => {
    localStorage.setItem('DarkTheme', (!isDark).toString());
    setIsDark(!isDark);
  }, [setIsDark, isDark]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        inverse,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
