import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Send,
} from '@mui/icons-material';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <Box>
      <Typography variant='h3' component='h1' gutterBottom>
        Kontakt
      </Typography>

      <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
        Jesteśmy tutaj, aby pomóc! Skontaktuj się z nami, jeśli potrzebujesz
        wsparcia, masz pytania lub uwagi.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom>
                Send us a Message
              </Typography>
              <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label='Name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label='Email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label='Subject'
                      name='subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      label='Message'
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      startIcon={<Send />}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Email />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Email'
                    secondary='support@mobywatel.gov'
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <Phone />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary='Phone' secondary='+1 (555) 123-4567' />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <LocationOn />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Address'
                    secondary='123 Government Plaza, City, State 12345'
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Office Hours'
                    secondary='Monday - Friday: 8:00 AM - 5:00 PM'
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
