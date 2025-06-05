import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  Alert,
  Chip,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';
import { useForm } from '../../hooks/useForm';
import { parseBackendError } from '../../utils/errorUtils';
import type { CitizenData } from '../pages/CitizenDashboard';

export interface DocumentRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentRequestData) => Promise<void>;
  citizenData: CitizenData | null;
}

export interface DocumentRequestData extends Record<string, unknown> {
  requestedDocument: 'IDENTITY_CARD' | 'DRIVER_LICENSE';
  photoURl: string;
  citizenship?: string;
  licenseCategory?: string[];
}

const DRIVER_LICENSE_CATEGORIES = [
  { value: 'AM', label: 'AM - Motorower' },
  { value: 'A1', label: 'A1 - Motocykle do 125cm³' },
  { value: 'A2', label: 'A2 - Motocykle do 35kW' },
  { value: 'A', label: 'A - Motocykle bez ograniczeń' },
  { value: 'B', label: 'B - Samochody osobowe' },
  { value: 'B1', label: 'B1 - Pojazdy trójkołowe' },
  { value: 'BE', label: 'BE - Samochody z przyczepą' },
  { value: 'C1', label: 'C1 - Pojazdy ciężarowe do 7,5t' },
  { value: 'C', label: 'C - Pojazdy ciężarowe' },
  { value: 'C1E', label: 'C1E - C1 z przyczepą' },
  { value: 'CE', label: 'CE - C z przyczepą' },
  { value: 'D1', label: 'D1 - Autobusy do 16 miejsc' },
  { value: 'D', label: 'D - Autobusy' },
  { value: 'D1E', label: 'D1E - D1 z przyczepą' },
  { value: 'DE', label: 'DE - D z przyczepą' },
  { value: 'T', label: 'T - Ciągniki rolnicze' },
];

export function DocumentRequestModal({
  open,
  onClose,
  onSubmit,
  citizenData,
}: DocumentRequestModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    values,
    errors,
    isSubmitting,
    generalError,
    handleChange,
    setError,
    handleSubmit,
    resetForm,
  } = useForm<DocumentRequestData>({
    initialValues: {
      requestedDocument: 'IDENTITY_CARD',
      photoURl: '',
      citizenship: 'POLSKA',
      licenseCategory: [],
    },
    requiredFields: ['requestedDocument', 'photoURl'],
    onSubmit: async (data) => {
      try {
        // Prepare data according to backend format
        const submitData = {
          ...data,
          licenseCategory:
            data.requestedDocument === 'DRIVER_LICENSE'
              ? selectedCategories
              : undefined,
          citizenship:
            data.requestedDocument === 'IDENTITY_CARD'
              ? data.citizenship
              : undefined,
        };

        await onSubmit(submitData);
        resetForm();
        setSelectedCategories([]);
        onClose();
      } catch (err) {
        const parsed = parseBackendError((err as Error)?.message || '');
        setError('general', parsed.message);
      }
    },
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleClose = () => {
    resetForm();
    setSelectedCategories([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>Wniosek o wydanie dokumentu</DialogTitle>

      <DialogContent>
        <Box component='form' sx={{ mt: 2 }}>
          {generalError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          {/* Auto-populated citizen data */}
          {citizenData && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <AppTypography variant='subtitle2' gutterBottom>
                Dane wnioskodawcy (wypełnione automatycznie)
              </AppTypography>
              <AppTypography variant='body2'>
                <strong>Imię i nazwisko:</strong> {citizenData.firstName}{' '}
                {citizenData.lastName}
              </AppTypography>
              <AppTypography variant='body2'>
                <strong>PESEL:</strong> {citizenData.PESEL}
              </AppTypography>
              <AppTypography variant='body2'>
                <strong>Data urodzenia:</strong>{' '}
                {new Date(citizenData.birthDate).toLocaleDateString('pl-PL')}
              </AppTypography>
            </Box>
          )}

          <FormControl component='fieldset' sx={{ mb: 3 }}>
            <FormLabel component='legend'>Typ dokumentu</FormLabel>
            <RadioGroup
              value={values.requestedDocument}
              onChange={(e) =>
                handleChange(
                  'requestedDocument',
                  e.target.value as 'IDENTITY_CARD' | 'DRIVER_LICENSE'
                )
              }
            >
              <FormControlLabel
                value='IDENTITY_CARD'
                control={<Radio />}
                label='Dowód osobisty'
              />
              <FormControlLabel
                value='DRIVER_LICENSE'
                control={<Radio />}
                label='Prawo jazdy'
              />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label='URL zdjęcia'
            value={values.photoURl}
            onChange={(e) => handleChange('photoURl', e.target.value)}
            required
            error={!!errors.photoURl}
            helperText={
              errors.photoURl || 'Podaj link do zdjęcia w formacie cyfrowym'
            }
            sx={{ mb: 3 }}
          />

          {values.requestedDocument === 'IDENTITY_CARD' && (
            <TextField
              fullWidth
              label='Obywatelstwo'
              value={values.citizenship}
              onChange={(e) => handleChange('citizenship', e.target.value)}
              required
              error={!!errors.citizenship}
              helperText={errors.citizenship}
              sx={{ mb: 3 }}
            />
          )}

          {values.requestedDocument === 'DRIVER_LICENSE' && (
            <Box>
              <FormLabel component='legend' sx={{ mb: 2 }}>
                Kategorie prawa jazdy
              </FormLabel>
              <AppTypography
                variant='body2'
                color='text.secondary'
                sx={{ mb: 2 }}
              >
                Wybierz kategorie, na które chcesz uzyskać uprawnienia:
              </AppTypography>

              <FormGroup>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {selectedCategories.map((category) => (
                    <Chip
                      key={category}
                      label={
                        DRIVER_LICENSE_CATEGORIES.find(
                          (c) => c.value === category
                        )?.label || category
                      }
                      onDelete={() => handleCategoryChange(category, false)}
                      color='primary'
                      variant='outlined'
                    />
                  ))}
                </Box>

                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {DRIVER_LICENSE_CATEGORIES.map((category) => (
                    <FormControlLabel
                      key={category.value}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(category.value)}
                          onChange={(e) =>
                            handleCategoryChange(
                              category.value,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={category.label}
                      sx={{ display: 'block', mb: 1 }}
                    />
                  ))}
                </Box>
              </FormGroup>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={handleClose}>Anuluj</AppButton>
        <AppButton
          onClick={handleSubmit}
          variant='contained'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Składanie wniosku...' : 'Złóż wniosek'}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
