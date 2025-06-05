import { Box, type SxProps, Alert } from '@mui/material';
import { AppTextField, AppButton } from '../atoms';
import { Send } from '@mui/icons-material';
import { useForm } from '../../hooks/useForm';
import { parseBackendError } from '../../utils/errorUtils';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  sx?: SxProps;
}

export const ContactForm = ({ onSubmit, sx }: ContactFormProps) => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    generalError,
    setError,
    isSubmitting,
  } = useForm<ContactFormData>({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    requiredFields: ['name', 'email', 'subject', 'message'],
    onSubmit: async (data) => {
      try {
        await onSubmit(data);
      } catch (err) {
        const parsed = parseBackendError((err as Error)?.message || '');
        if (parsed.field) {
          setError(parsed.field as keyof ContactFormData, parsed.message);
        } else {
          setError('general', parsed.message);
        }
      }
    },
  });

  return (
    <Box component='form' onSubmit={handleSubmit} sx={sx}>
      {generalError && (
        <Box sx={{ mb: 2 }}>
          <Alert severity='error'>{generalError}</Alert>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <AppTextField
          name='name'
          label='Imię i nazwisko'
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <AppTextField
          name='email'
          label='Email'
          type='email'
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          error={!!errors.email}
          helperText={errors.email}
        />
      </Box>
      <AppTextField
        name='subject'
        label='Temat'
        value={values.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
        required
        error={!!errors.subject}
        helperText={errors.subject}
        sx={{ mb: 2 }}
      />
      <AppTextField
        name='message'
        label='Wiadomość'
        multiline
        rows={4}
        value={values.message}
        onChange={(e) => handleChange('message', e.target.value)}
        required
        error={!!errors.message}
        helperText={errors.message}
        sx={{ mb: 3 }}
      />
      <AppButton
        type='submit'
        variant='contained'
        startIcon={<Send />}
        size='large'
        disabled={isSubmitting}
      >
        Wyślij wiadomość
      </AppButton>
    </Box>
  );
};

export default ContactForm;
