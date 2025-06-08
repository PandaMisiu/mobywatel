import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';
import { useForm } from '../../hooks/useForm';
import { parseBackendError } from '../../utils/errorUtils';
import type { OfficialCreateData } from '../../types/admin';

export interface CreateOfficialModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OfficialCreateData) => Promise<void>;
}

export function CreateOfficialModal({
  open,
  onClose,
  onSubmit,
}: CreateOfficialModalProps) {
  const {
    values,
    errors,
    isSubmitting,
    generalError,
    handleChange,
    setError,
    handleSubmit,
    resetForm,
  } = useForm<OfficialCreateData>({
    initialValues: {
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      password: '',
    },
    requiredFields: ['firstName', 'lastName', 'position', 'email', 'password'],
    onSubmit: async (data) => {
      try {
        await onSubmit(data);
        resetForm();
        onClose();
      } catch (err) {
        const parsed = parseBackendError((err as Error)?.message || '');
        setError('general', parsed.message);
      }
    },
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle component='div'>Utwórz nowe konto urzędnika</DialogTitle>

      <DialogContent>
        <Box component='form' sx={{ mt: 2 }}>
          {generalError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <AppTypography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Wypełnij wszystkie pola, aby utworzyć nowe konto urzędnika w
            systemie.
          </AppTypography>

          <TextField
            fullWidth
            label='Imię'
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Nazwisko'
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Stanowisko'
            value={values.position}
            onChange={(e) => handleChange('position', e.target.value)}
            required
            error={!!errors.position}
            helperText={errors.position}
            placeholder='np. Urzędnik ds. wydawania dokumentów'
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Email'
            type='email'
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            error={!!errors.email}
            helperText={errors.email}
            placeholder='uzrednik@mobywatel.gov.pl'
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Hasło'
            type='password'
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            error={!!errors.password}
            helperText={errors.password || 'Minimum 8 znaków'}
            sx={{ mb: 2 }}
          />

          <Alert severity='info' sx={{ mt: 2 }}>
            <AppTypography variant='body2'>
              <strong>Informacja:</strong> Po utworzeniu konta urzędnik będzie
              mógł się zalogować używając podanego adresu email i hasła. Konto
              będzie natychmiast aktywne.
            </AppTypography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={handleClose}>Anuluj</AppButton>
        <AppButton
          onClick={handleSubmit}
          variant='contained'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Tworzenie...' : 'Utwórz konto'}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
