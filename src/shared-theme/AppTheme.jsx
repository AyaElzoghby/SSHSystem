import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1A73E8' },
          background: { default: '#f9fafb', paper: '#fff' },
        }
      : {
          primary: { main: '#90caf9' },
          background: { default: '#121212', paper: '#1e1e1e' },
        }),
  },
});

export default function AppTheme({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light');

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
}
