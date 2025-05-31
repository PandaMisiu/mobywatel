import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          mObywatel
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
