import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navigation() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          mObywatel
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            color='inherit'
            component={RouterLink}
            to='/'
            sx={{
              backgroundColor: isActive('/')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            Strona główna
          </Button>
          <Button
            color='inherit'
            component={RouterLink}
            to='/about'
            sx={{
              backgroundColor: isActive('/about')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            O nas
          </Button>
          <Button
            color='inherit'
            component={RouterLink}
            to='/contact'
            sx={{
              backgroundColor: isActive('/contact')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            Kontakt
          </Button>
          <IconButton
            color='inherit'
            onClick={toggleDarkMode}
            aria-label='toggle dark mode'
            sx={{ ml: 1 }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
