import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { Business, Groups, Security } from '@mui/icons-material';

export default function About() {
  return (
    <Box>
      <Typography variant='h3' component='h1' gutterBottom>
        O mObywatel
      </Typography>

      <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
        mObywatel to kompleksowa cyfrowa platforma rządowa zaprojektowana w celu
        usprawnienia usług dla obywateli i wzmocnienia relacji między rządem a
        społecznością.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Business />
                </Avatar>
                <Typography variant='h5' component='h2'>
                  Nasza misja
                </Typography>
              </Box>
              <Typography variant='body1' sx={{ mb: 2 }}>
                Zapewnienie obywatelom łatwego, bezpiecznego i wydajnego dostępu
                do usług rządowych poprzez innowacyjne rozwiązania cyfrowe.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label='Transformacja cyfrowa' color='primary' />
                <Chip label='Zorientowane na obywatela' color='primary' />
                <Chip label='Transparentność' color='primary' />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Groups />
                </Avatar>
                <Typography variant='h5' component='h2'>
                  Nasze wartości
                </Typography>
              </Box>
              <Typography variant='body1' sx={{ mb: 2 }}>
                Wierzymy w dostępność, bezpieczeństwo i transparentność we
                wszystkich interakcjach rządowych. Nasza platforma jest
                zbudowana z obywatelem w centrum.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label='Dostępność' color='secondary' />
                <Chip label='Bezpieczeństwo' color='secondary' />
                <Chip label='Innowacyjność' color='secondary' />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Security />
                </Avatar>
                <Typography variant='h5' component='h2'>
                  Bezpieczeństwo i prywatność
                </Typography>
              </Box>
              <Typography variant='body1' sx={{ mb: 2 }}>
                Twoja prywatność i bezpieczeństwo danych to nasze najwyższe
                priorytety. Stosujemy wiodące w branży środki bezpieczeństwa, w
                tym szyfrowanie end-to-end, bezpieczną autoryzację i regularne
                audyty bezpieczeństwa, aby chronić Twoje dane osobowe.
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Wszystkie dane są przetwarzane zgodnie z przepisami o ochronie
                danych i rządowymi standardami bezpieczeństwa.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
