import React from 'react';
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
import type { OfficialData, OfficialUpdateData } from '../../types/admin';

export interface EditOfficialModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OfficialUpdateData) => Promise<void>;
  officialData: OfficialData | null;
}

export function EditOfficialModal({
  open,
  onClose,
  onSubmit,
  officialData,
}: EditOfficialModalProps) {
  // Create initial values based on officialData - memoized to prevent recreations
  const initialValues = React.useMemo((): OfficialUpdateData => {
    return {
      officialID: officialData?.officialID || 0,
      firstName: officialData?.firstName || '',
      lastName: officialData?.lastName || '',
      position: officialData?.position || '',
      email: officialData?.email || '',
      password: '', // Always empty for updates - optional field
    };
  }, [
    officialData?.officialID,
    officialData?.firstName,
    officialData?.lastName,
    officialData?.position,
    officialData?.email,
  ]);

  const {
    values,
    errors,
    isSubmitting,
    generalError,
    handleChange,
    setError,
    handleSubmit,
    resetForm,
  } = useForm<OfficialUpdateData>({
    initialValues,
    requiredFields: ['firstName', 'lastName', 'position', 'email'],
    onSubmit: async (data) => {
      try {
        // Only include password if it's provided
        const submitData = { ...data };
        if (!submitData.password?.trim()) {
          delete submitData.password;
        }

        await onSubmit(submitData);
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
      <DialogTitle component='div'>Edytuj dane urzędnika</DialogTitle>

      <DialogContent>
        <Box component='form' sx={{ mt: 2 }}>
          {generalError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          {officialData && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <AppTypography
                variant='subtitle2'
                gutterBottom
                color='text.primary'
              >
                Edytujesz dane urzędnika ID: {officialData.officialID}
              </AppTypography>
            </Box>
          )}

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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Nowe hasło (opcjonalne)'
            type='password'
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={!!errors.password}
            helperText={
              errors.password || 'Pozostaw puste, aby nie zmieniać hasła'
            }
            sx={{ mb: 2 }}
          />

          <Alert severity='warning' sx={{ mt: 2 }}>
            <AppTypography variant='body2'>
              <strong>Uwaga:</strong> Zmiany danych urzędnika będą natychmiast
              widoczne w systemie. Upewnij się, że wszystkie dane są poprawne.
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
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
