import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Paper,
} from '@mui/material';
import {
  HomeOutlined,
  SecurityOutlined,
  GroupOutlined,
} from '@mui/icons-material';

export default function Home() {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 6,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant='h2' component='h1' gutterBottom>
          Witamy w mObywatel
        </Typography>
        <Typography variant='h5' component='p' sx={{ mb: 3 }}>
          Twój portal cyfrowych usług rządowych
        </Typography>
        <Button variant='contained' color='secondary' size='large'>
          Rozpocznij
        </Button>
      </Paper>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <HomeOutlined
                sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
              />
              <Typography variant='h5' component='h2' gutterBottom>
                Usługi dla obywateli
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Uzyskaj dostęp do swoich dokumentów osobistych, składaj wnioski
                o pozwolenia i zarządzaj usługami rządowymi online.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <SecurityOutlined
                sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
              />
              <Typography variant='h5' component='h2' gutterBottom>
                Bezpieczna platforma
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Twoje dane są chronione za pomocą zaawansowanych środków
                bezpieczeństwa i szyfrowania, aby zapewnić prywatność i
                bezpieczeństwo.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <GroupOutlined
                sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
              />
              <Typography variant='h5' component='h2' gutterBottom>
                Społeczność
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Połącz się ze swoją lokalną społecznością i bądź na bieżąco z
                inicjatywami rządowymi i aktualizacjami.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
