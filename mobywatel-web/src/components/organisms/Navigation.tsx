import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Brightness4, Brightness7, AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { AppTypography, AppButton } from '../atoms';

export default function Navigation() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

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

          {user ? (
            <>
              {user.roles?.includes('ROLE_CITIZEN') && (
                <AppButton
                  color='inherit'
                  variant='text'
                  component={RouterLink}
                  to='/dashboard'
                  sx={{
                    backgroundColor: isActive('/dashboard')
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                  }}
                >
                  Panel obywatela
                </AppButton>
              )}
              {user.roles?.includes('ROLE_OFFICIAL') && (
                <AppButton
                  color='inherit'
                  variant='text'
                  component={RouterLink}
                  to='/official-dashboard'
                  sx={{
                    backgroundColor: isActive('/official-dashboard')
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                  }}
                >
                  Panel urzędnika
                </AppButton>
              )}
              <IconButton
                color='inherit'
                onClick={handleMenuOpen}
                aria-label='account menu'
                sx={{ ml: 1 }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <AppTypography variant='body2'>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email}
                  </AppTypography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
              </Menu>
            </>
          ) : (
            <>
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
            </>
          )}

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
