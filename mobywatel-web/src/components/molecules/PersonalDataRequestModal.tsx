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
  Divider,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';
import { useForm } from '../../hooks/useForm';
import { parseBackendError } from '../../utils/errorUtils';
import type { CitizenData } from '../pages/CitizenDashboard';

export interface PersonalDataRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalDataRequestData) => Promise<void>;
  currentData: CitizenData | null;
}

export interface PersonalDataRequestData extends Record<string, unknown> {
  requestedFirstName: string;
  requestedLastName: string;
  requestedGender: 'MALE' | 'FEMALE';
}

export function PersonalDataRequestModal({
  open,
  onClose,
  onSubmit,
  currentData,
}: PersonalDataRequestModalProps) {
  const {
    values,
    errors,
    isSubmitting,
    generalError,
    handleChange,
    setError,
    handleSubmit,
    resetForm,
  } = useForm<PersonalDataRequestData>({
    initialValues: {
      requestedFirstName: currentData?.firstName || '',
      requestedLastName: currentData?.lastName || '',
      requestedGender: currentData?.gender || 'MALE',
    },
    requiredFields: [
      'requestedFirstName',
      'requestedLastName',
      'requestedGender',
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

  const hasChanges =
    currentData &&
    (values.requestedFirstName !== currentData.firstName ||
      values.requestedLastName !== currentData.lastName ||
      values.requestedGender !== currentData.gender);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Wniosek o zmianę danych osobowych</DialogTitle>

      <DialogContent>
        <Box component='form' sx={{ mt: 2 }}>
          {generalError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <AppTypography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Wypełnij formularz, aby wnioskować o zmianę swoich danych osobowych.
            Wniosek zostanie przekazany do weryfikacji przez urzędnika.
          </AppTypography>

          {/* Current data display */}
          {currentData && (
            <>
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
                  Aktualne dane
                </AppTypography>
                <AppTypography variant='body2' color='text.primary'>
                  <strong>Imię:</strong> {currentData.firstName}
                </AppTypography>
                <AppTypography variant='body2' color='text.primary'>
                  <strong>Nazwisko:</strong> {currentData.lastName}
                </AppTypography>
                <AppTypography variant='body2' color='text.primary'>
                  <strong>Płeć:</strong>{' '}
                  {currentData.gender === 'MALE' ? 'Mężczyzna' : 'Kobieta'}
                </AppTypography>
              </Box>

              <Divider sx={{ mb: 3 }} />
            </>
          )}

          <AppTypography variant='subtitle2' gutterBottom>
            Wnioskowane zmiany
          </AppTypography>

          <TextField
            fullWidth
            label='Nowe imię'
            value={values.requestedFirstName}
            onChange={(e) => handleChange('requestedFirstName', e.target.value)}
            required
            error={!!errors.requestedFirstName}
            helperText={errors.requestedFirstName}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Nowe nazwisko'
            value={values.requestedLastName}
            onChange={(e) => handleChange('requestedLastName', e.target.value)}
            required
            error={!!errors.requestedLastName}
            helperText={errors.requestedLastName}
            sx={{ mb: 3 }}
          />

          <FormControl component='fieldset' sx={{ mb: 3 }}>
            <FormLabel component='legend'>Płeć</FormLabel>
            <RadioGroup
              value={values.requestedGender}
              onChange={(e) =>
                handleChange(
                  'requestedGender',
                  e.target.value as 'MALE' | 'FEMALE'
                )
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

          {!hasChanges && (
            <Alert severity='info' sx={{ mb: 2 }}>
              Nie wprowadzono żadnych zmian w stosunku do aktualnych danych.
            </Alert>
          )}

          <Alert severity='warning' sx={{ mb: 2 }}>
            <AppTypography variant='body2'>
              <strong>Uwaga:</strong> Zmiana danych osobowych wymaga weryfikacji
              dokumentów. Po złożeniu wniosku skontaktuj się z urzędem w celu
              dostarczenia wymaganych dokumentów.
            </AppTypography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={handleClose}>Anuluj</AppButton>
        <AppButton
          onClick={handleSubmit}
          variant='contained'
          disabled={isSubmitting || !hasChanges}
        >
          {isSubmitting ? 'Składanie wniosku...' : 'Złóż wniosek'}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
