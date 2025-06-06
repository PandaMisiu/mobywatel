import { Box, Alert, type SxProps, type Theme } from '@mui/material';
import { AppTextField, AppButton } from '../atoms';
import { Login } from '@mui/icons-material';
import { useForm } from '../../hooks/useForm';

export interface LoginFormData extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  sx?: SxProps<Theme>;
}

export const LoginForm = ({
  onSubmit,
  loading = false,
  error,
  sx,
}: LoginFormProps) => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    generalError,
    isSubmitting,
  } = useForm<LoginFormData>({
    initialValues: { email: '', password: '' },
    requiredFields: ['email', 'password'],
    onSubmit: async (data) => {
      await onSubmit(data);
    },
  });

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={sx}
      aria-label='Formularz logowania'
    >
      {(generalError || error) && (
        <Alert severity='error' sx={{ mb: 2 }} role='alert'>
          {generalError || error}
        </Alert>
      )}
      <AppTextField
        name='email'
        label='Adres email'
        type='email'
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      <AppTextField
        name='password'
        label='Hasło'
        type='password'
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
        required
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 3 }}
        aria-describedby={errors.password ? 'password-error' : undefined}
      />
      <AppButton
        type='submit'
        fullWidth
        size='large'
        disabled={loading || isSubmitting}
        startIcon={<Login />}
        aria-label={
          loading || isSubmitting ? 'Logowanie w toku' : 'Zaloguj się'
        }
      >
        {loading || isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
      </AppButton>
    </Box>
  );
};

export default LoginForm;
