import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Tooltip from '@mui/material/Tooltip';

export default function ColorModeSelect({ sx }) {
  const [mode, setMode] = React.useState(() => {
    const saved = localStorage.getItem('mode');
    return saved || 'light';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Tooltip title="Toggle light/dark mode">
      <IconButton onClick={toggleMode} sx={sx}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
