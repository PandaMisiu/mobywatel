import { Grid } from '@mui/material';
import { Business, Groups, Security } from '@mui/icons-material';
import { PageLayout } from '../organisms';
import { InfoCard } from '../molecules';

export default function About() {
  return (
    <PageLayout
      title='O mObywatel'
      subtitle='mObywatel to kompleksowa cyfrowa platforma rządowa zaprojektowana w celu usprawnienia usług dla obywateli i wzmocnienia relacji między rządem a społecznością.'
    >
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoCard
            Avatar={Business}
            title='Nasza misja'
            content='Zapewnienie obywatelom łatwego, bezpiecznego i wydajnego dostępu do usług rządowych poprzez innowacyjne rozwiązania cyfrowe.'
            chips={[
              'Transformacja cyfrowa',
              'Zorientowane na obywatela',
              'Transparentność',
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoCard
            Avatar={Groups}
            title='Nasze wartości'
            content='Wierzymy w dostępność, bezpieczeństwo i transparentność we wszystkich interakcjach rządowych. Nasza platforma jest zbudowana z obywatelem w centrum.'
            chips={['Dostępność', 'Bezpieczeństwo', 'Innowacyjność']}
            sx={{ bgcolor: 'background.default' }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <InfoCard
            Avatar={Security}
            title='Bezpieczeństwo i prywatność'
            content='Twoja prywatność i bezpieczeństwo danych to nasze najwyższe priorytety. Stosujemy wiodące w branży środki bezpieczeństwa, w tym szyfrowanie end-to-end, bezpieczną autoryzację i regularne audyty bezpieczeństwa, aby chronić Twoje dane osobowe. Wszystkie dane są przetwarzane zgodnie z przepisami o ochronie danych i rządowymi standardami bezpieczeństwa.'
            sx={{ bgcolor: 'success.50' }}
          />
        </Grid>
      </Grid>
    </PageLayout>
  );
}
