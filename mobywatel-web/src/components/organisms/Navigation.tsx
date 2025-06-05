import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { AppTypography, AppButton } from '../atoms';

export default function Navigation() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position='static'>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <RouterLink
            to='/'
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <AppTypography
              variant='h6'
              sx={{
                cursor: 'pointer',
                display: 'inline-block',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              mObywatel
            </AppTypography>
          </RouterLink>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <AppButton
            color='inherit'
            variant='text'
            component={RouterLink}
            to='/'
            sx={{
              backgroundColor: isActive('/')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            Strona główna
          </AppButton>
          <AppButton
            color='inherit'
            variant='text'
            component={RouterLink}
            to='/about'
            sx={{
              backgroundColor: isActive('/about')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            O nas
          </AppButton>
          <AppButton
            color='inherit'
            variant='text'
            component={RouterLink}
            to='/contact'
            sx={{
              backgroundColor: isActive('/contact')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            Kontakt
          </AppButton>
          <AppButton
            color='inherit'
            variant='text'
            component={RouterLink}
            to='/login'
            sx={{
              backgroundColor: isActive('/login')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            Logowanie
          </AppButton>
          <AppButton
            color='inherit'
            variant='text'
            component={RouterLink}
            to='/register'
            sx={{
              backgroundColor: isActive('/register')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            }}
          >
            Rejestracja
          </AppButton>
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
