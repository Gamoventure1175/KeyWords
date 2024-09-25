import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import customTheme from '@/theme/CustomTheme'; // Import your custom theme

const ThemeContext = createContext();

export const ThemeProviderComponent = ({ children }) => {
  // Set default mode to 'light' directly
  const [mode, setMode] = useState('light');

  // No need to useEffect for checking localStorage or system preferences

  const theme = customTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ mode }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);
