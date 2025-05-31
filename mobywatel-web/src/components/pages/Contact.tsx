import {
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Email, Phone, LocationOn, AccessTime } from '@mui/icons-material';
import { PageLayout } from '../organisms';
import { ContactForm } from '../molecules';
import type { ContactFormData } from '../molecules';
import { AppTypography, AppAvatar } from '../atoms';

export default function Contact() {
  const handleSubmit = (data: ContactFormData) => {
    // Handle form submission
    alert(`Wiadomość od ${data.name} została wysłana!`);
  };

  return (
    <PageLayout
      title='Kontakt'
      subtitle='Jesteśmy tutaj, aby pomóc! Skontaktuj się z nami, jeśli potrzebujesz wsparcia, masz pytania lub uwagi.'
    >
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <AppTypography variant='h5' component='h2' gutterBottom>
                Wyślij nam wiadomość
              </AppTypography>
              <ContactForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <AppTypography variant='h5' component='h2' gutterBottom>
                Informacje kontaktowe
              </AppTypography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AppAvatar icon={<Email />} />
                  </ListItemIcon>
                  <ListItemText
                    primary='kontakt@mobywatel.gov.pl'
                    secondary='Odpowiadamy w ciągu 24 godzin'
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AppAvatar
                      icon={<Phone />}
                      sx={{ bgcolor: 'success.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary='+48 800 123 456'
                    secondary='Pon-Pt: 8:00-18:00'
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AppAvatar
                      icon={<LocationOn />}
                      sx={{ bgcolor: 'warning.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary='ul. Cyfrowa 1, 00-001 Warszawa'
                    secondary='Siedziba główna'
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AppAvatar
                      icon={<AccessTime />}
                      sx={{ bgcolor: 'info.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary='Godziny pracy'
                    secondary='Pon-Pt: 8:00-18:00, Sob: 9:00-14:00'
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
