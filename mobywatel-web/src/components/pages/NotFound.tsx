import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Box, Card, CardContent } from '@mui/material';
import { HomeOutlined, ErrorOutline } from '@mui/icons-material';

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
          <Typography variant='h2' component='h1' gutterBottom color='error'>
            404
          </Typography>
          <Typography variant='h5' component='h2' gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button
            variant='contained'
            component={RouterLink}
            to='/'
            startIcon={<HomeOutlined />}
            size='large'
            sx={{ mt: 2 }}
          >
            Go back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
