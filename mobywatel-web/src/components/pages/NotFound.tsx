import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent } from '@mui/material';
import { HomeOutlined, ErrorOutline } from '@mui/icons-material';
import { AppTypography, AppButton } from '../atoms';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <ErrorOutline
            sx={{
              fontSize: 72,
              color: 'error.main',
              mb: 2,
            }}
          />
          <AppTypography variant='h2' component='h1' gutterBottom color='error'>
            404
          </AppTypography>
          <AppTypography variant='h5' component='h2' gutterBottom>
            Strona nie została znaleziona
          </AppTypography>
          <AppTypography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
            Strona, której szukasz, nie istnieje lub została przeniesiona.
          </AppTypography>
          <AppButton
            variant='contained'
            component={RouterLink}
            to='/'
            startIcon={<HomeOutlined />}
            size='large'
            sx={{ mt: 2 }}
          >
            Powrót do strony głównej
          </AppButton>
        </CardContent>
      </Card>
    </Box>
  );
}
