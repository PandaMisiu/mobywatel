import { createContext } from 'react';
import type { Theme } from '@mui/material/styles';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
