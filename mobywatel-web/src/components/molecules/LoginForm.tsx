import { Box, Alert, type SxProps } from '@mui/material';
import { AppTextField, AppButton } from '../atoms';
import { Login } from '@mui/icons-material';
import { useForm } from '../../hooks/useForm';
import { parseBackendError } from '../../utils/errorUtils';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  sx?: SxProps;
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
    setError,
    isSubmitting,
  } = useForm<LoginFormData>({
    initialValues: { email: '', password: '' },
    requiredFields: ['email', 'password'],
    onSubmit: async (data) => {
      try {
        await onSubmit(data);
      } catch (err) {
        // Parse backend error and set field/general error
        const parsed = parseBackendError((err as Error)?.message || '');
        if (parsed.field) {
          setError(parsed.field as keyof LoginFormData, parsed.message);
        } else {
          setError('general', parsed.message);
        }
      }
    },
  });

  return (
    <Box component='form' onSubmit={handleSubmit} sx={sx}>
      {(generalError || error) && (
        <Alert severity='error' sx={{ mb: 2 }}>
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
      />
      <AppButton
        type='submit'
        fullWidth
        size='large'
        disabled={loading || isSubmitting}
        startIcon={<Login />}
      >
        {loading || isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
      </AppButton>
    </Box>
  );
};

export default LoginForm;
