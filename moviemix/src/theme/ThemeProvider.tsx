import { createContext, useContext } from 'react';
import { tokens } from './tokens';

const ThemeContext = createContext({ tokens });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ tokens }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
