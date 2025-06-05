import {
  Box,
  Alert,
  Grid,
  MenuItem,
  type SxProps,
  type Theme,
} from '@mui/material';
import { AppTextField, AppButton } from '../atoms';
import { PersonAdd } from '@mui/icons-material';
import { useForm } from '../../hooks/useForm';

export interface RegisterFormData extends Record<string, unknown> {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  PESEL: string;
  gender: string;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  sx?: SxProps<Theme>;
}

const genderOptions = [
  { value: 'MALE', label: 'Mężczyzna' },
  { value: 'FEMALE', label: 'Kobieta' },
];

export const RegisterForm = ({
  onSubmit,
  loading = false,
  error,
  sx,
}: RegisterFormProps) => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    generalError,
    isSubmitting,
  } = useForm<RegisterFormData>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      PESEL: '',
      gender: '',
    },
    requiredFields: [
      'email',
      'password',
      'firstName',
      'lastName',
      'birthDate',
      'PESEL',
      'gender',
    ],
    onSubmit: async (data) => {
      await onSubmit(data);
    },
  });

  return (
    <Box component='form' onSubmit={handleSubmit} sx={sx}>
      {(generalError || error) && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {generalError || error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            name='firstName'
            label='Imię'
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            name='lastName'
            label='Nazwisko'
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField
            name='email'
            label='Adres email'
            type='email'
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField
            name='password'
            label='Hasło'
            type='password'
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            error={!!errors.password}
            helperText={
              errors.password ||
              'Hasło musi zawierać co najmniej 8 znaków: małą literę, wielką literę, cyfrę i znak specjalny'
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            name='birthDate'
            label='Data urodzenia'
            type='date'
            value={values.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            required
            error={!!errors.birthDate}
            helperText={errors.birthDate || 'Format: YYYY-MM-DD'}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            name='PESEL'
            label='PESEL'
            value={values.PESEL}
            onChange={(e) => handleChange('PESEL', e.target.value)}
            required
            error={!!errors.PESEL}
            helperText={errors.PESEL || '11-cyfrowy numer PESEL'}
            inputProps={{ maxLength: 11 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField
            name='gender'
            label='Płeć'
            select
            value={values.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            required
            error={!!errors.gender}
            helperText={errors.gender}
          >
            {genderOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </AppTextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppButton
            type='submit'
            fullWidth
            size='large'
            disabled={loading || isSubmitting}
            startIcon={<PersonAdd />}
            sx={{ mt: 2 }}
          >
            {loading || isSubmitting ? 'Rejestracja...' : 'Zarejestruj się'}
          </AppButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;
