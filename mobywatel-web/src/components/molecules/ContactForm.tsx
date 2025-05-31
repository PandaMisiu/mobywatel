import { Box, type SxProps } from '@mui/material';
import { AppTextField, AppButton } from '../atoms';
import { Send } from '@mui/icons-material';
import { useState } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  sx?: SxProps;
}

export const ContactForm = ({ onSubmit, sx }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
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
    onSubmit(formData);
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={sx}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <AppTextField
          name='name'
          label='Imię i nazwisko'
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <AppTextField
          name='email'
          label='Email'
          type='email'
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </Box>
      <AppTextField
        name='subject'
        label='Temat'
        value={formData.subject}
        onChange={handleInputChange}
        required
        sx={{ mb: 2 }}
      />
      <AppTextField
        name='message'
        label='Wiadomość'
        multiline
        rows={4}
        value={formData.message}
        onChange={handleInputChange}
        required
        sx={{ mb: 3 }}
      />
      <AppButton
        type='submit'
        variant='contained'
        startIcon={<Send />}
        size='large'
      >
        Wyślij wiadomość
      </AppButton>
    </Box>
  );
};

export default ContactForm;
