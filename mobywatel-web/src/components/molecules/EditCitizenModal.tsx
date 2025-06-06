import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Alert,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';
import { useForm } from '../../hooks/useForm';
import { parseBackendError } from '../../utils/errorUtils';
import type { CitizenData, CitizenUpdateData } from '../../types/official';

export interface EditCitizenModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CitizenUpdateData) => Promise<void>;
  citizenData: CitizenData | null;
}

export function EditCitizenModal({
  open,
  onClose,
  onSubmit,
  citizenData,
}: EditCitizenModalProps) {
  // Create initial values based on citizenData - memoized to prevent recreations
  const initialValues = React.useMemo((): CitizenUpdateData => {
    return {
      citizenID: citizenData?.citizenID || 0,
      firstName: citizenData?.firstName || '',
      lastName: citizenData?.lastName || '',
      birthDate: citizenData?.birthDate || '',
      PESEL: citizenData?.PESEL || '',
      gender: citizenData?.gender || 'MALE',
      email: citizenData?.email || '',
    };
  }, [
    citizenData?.citizenID,
    citizenData?.firstName,
    citizenData?.lastName,
    citizenData?.birthDate,
    citizenData?.PESEL,
    citizenData?.gender,
    citizenData?.email,
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
  } = useForm<CitizenUpdateData>({
    initialValues,
    requiredFields: [
      'firstName',
      'lastName',
      'birthDate',
      'PESEL',
      'gender',
      'email',
    ],
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
      <DialogTitle component='div'>Edytuj dane obywatela</DialogTitle>

      <DialogContent>
        <Box component='form' sx={{ mt: 2 }}>
          {generalError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {generalError}
            </Alert>
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
            label='Data urodzenia'
            type='date'
            value={values.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            required
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='PESEL'
            value={values.PESEL}
            onChange={(e) => handleChange('PESEL', e.target.value)}
            required
            error={!!errors.PESEL}
            helperText={errors.PESEL}
            inputProps={{ maxLength: 11 }}
            sx={{ mb: 2 }}
          />

          <FormControl component='fieldset' sx={{ mb: 2 }}>
            <FormLabel component='legend'>Płeć</FormLabel>
            <RadioGroup
              value={values.gender}
              onChange={(e) =>
                handleChange('gender', e.target.value as 'MALE' | 'FEMALE')
              }
            >
              <FormControlLabel
                value='MALE'
                control={<Radio />}
                label='Mężczyzna'
              />
              <FormControlLabel
                value='FEMALE'
                control={<Radio />}
                label='Kobieta'
              />
            </RadioGroup>
          </FormControl>

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

          <Alert severity='warning' sx={{ mt: 2 }}>
            <AppTypography variant='body2'>
              <strong>Uwaga:</strong> Zmiany danych obywatela będą natychmiast
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
