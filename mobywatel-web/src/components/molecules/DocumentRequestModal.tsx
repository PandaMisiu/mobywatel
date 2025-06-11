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
  Button,
  Typography,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { AppButton, AppTypography } from '../atoms';
import { parseBackendError } from '../../utils/errorUtils';
import type { CitizenData } from '../pages/CitizenDashboard';

export interface DocumentRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  citizenData: CitizenData | null;
}

export interface DocumentRequestData extends Record<string, unknown> {
  requestedDocument: 'IDENTITY_CARD' | 'DRIVER_LICENSE';
  photo: File | null;
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

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function DocumentRequestModal({
                                       open,
                                       onClose,
                                       onSubmit,
                                       citizenData,
                                     }: DocumentRequestModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  // Manual form state management for FormData
  const [values, setValues] = useState<DocumentRequestData>({
    requestedDocument: 'IDENTITY_CARD',
    photo: null,
    citizenship: 'POLSKA',
    licenseCategory: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (name: keyof DocumentRequestData, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const setError = (field: string, message: string) => {
    if (field === 'general') {
      setGeneralError(message);
    } else {
      setErrors(prev => ({ ...prev, [field]: message }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;

    // Clear previous errors
    setErrors({});
    setGeneralError('');

    // Validate required fields
    if (!selectedFile) {
      setError('photo', 'Zdjęcie jest wymagane');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart request
      const formData = new FormData();
      formData.append('requestedDocument', values.requestedDocument);
      formData.append('photo', selectedFile);

      if (values.requestedDocument === 'IDENTITY_CARD' && values.citizenship) {
        formData.append('citizenship', values.citizenship);
      }

      if (values.requestedDocument === 'DRIVER_LICENSE' && selectedCategories.length > 0) {
        selectedCategories.forEach(category => {
          formData.append('licenseCategory', category);
        });
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await onSubmit(formData);

      // Reset form on success
      setValues({
        requestedDocument: 'IDENTITY_CARD',
        photo: null,
        citizenship: 'POLSKA',
        licenseCategory: [],
      });
      setSelectedCategories([]);
      setSelectedFile(null);
      setFileError('');
      onClose();
    } catch (err) {
      const parsed = parseBackendError((err as Error)?.message || '');
      setError('general', parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues({
      requestedDocument: 'IDENTITY_CARD',
      photo: null,
      citizenship: 'POLSKA',
      licenseCategory: [],
    });
    setErrors({});
    setGeneralError('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError('');

    if (!file) {
      setSelectedFile(null);
      handleChange('photo', null);
      return;
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError('Dozwolone formaty: JPEG, PNG, WebP');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Rozmiar pliku nie może przekraczać 5MB');
      return;
    }

    setSelectedFile(file);
    handleChange('photo', file);
  };

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
    setSelectedFile(null);
    setFileError('');
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    Dane wnioskodawcy (wypełnione automatycznie)
                  </AppTypography>
                  <AppTypography variant='body2' color='text.primary'>
                    <strong>Imię i nazwisko:</strong> {citizenData.firstName}{' '}
                    {citizenData.lastName}
                  </AppTypography>
                  <AppTypography variant='body2' color='text.primary'>
                    <strong>PESEL:</strong> {citizenData.PESEL}
                  </AppTypography>
                  <AppTypography variant='body2' color='text.primary'>
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

            {/* File Upload Section */}
            <Box sx={{ mb: 3 }}>
              <FormLabel component='legend' sx={{ mb: 2 }}>
                Zdjęcie *
              </FormLabel>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Dodaj zdjęcie w formacie JPEG, PNG lub WebP (max. 5MB)
              </Typography>

              <Button
                  component='label'
                  variant={selectedFile ? 'outlined' : 'contained'}
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
              >
                {selectedFile ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}
                <input
                    type='file'
                    hidden
                    accept='image/jpeg,image/jpg,image/png,image/webp'
                    onChange={handleFileChange}
                />
              </Button>

              {selectedFile && (
                  <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'background.default',
                      }}
                  >
                    <Typography variant='body2' color='text.primary'>
                      <strong>Wybrane zdjęcie:</strong> {selectedFile.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Rozmiar: {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
              )}

              {(fileError || errors.photo) && (
                  <Alert severity='error' sx={{ mt: 1 }}>
                    {fileError || errors.photo}
                  </Alert>
              )}
            </Box>

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
              disabled={isSubmitting || !selectedFile}
          >
            {isSubmitting ? 'Składanie wniosku...' : 'Złóż wniosek'}
          </AppButton>
        </DialogActions>
      </Dialog>
  );
}