import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Divider } from '@mui/material';
import { PageLayout } from '../organisms';
import { LoginForm } from '../molecules';
import type { LoginFormData } from '../molecules/LoginForm';
import { AppTypography, AppButton } from '../atoms';
import { useAuth } from '../../hooks/useAuth';
import { parseBackendError } from '../../utils/errorUtils';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in and auth check is complete
  useEffect(() => {
    if (user && !isLoading && user.roles && user.roles.length > 0) {
      // Redirect based on user role
      if (user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin-dashboard');
      } else if (user.roles.includes('ROLE_OFFICIAL')) {
        navigate('/official-dashboard');
      } else if (user.roles.includes('ROLE_CITIZEN')) {
        navigate('/dashboard');
      } else {
        // Fallback for unknown roles
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Login attempt for email:', data.email);
      }
      await login(data.email, data.password);
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Login successful');
      }
      // Login successful - the useEffect above will handle redirect
      // after user roles are fully loaded
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Login error:', err);
      }
      const errorMessage =
        err instanceof Error ? err.message : 'Błąd podczas logowania';
      const parsedError = parseBackendError(errorMessage);
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Setting error message:', parsedError.message);
      }
      setError(parsedError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title='Logowanie'
      subtitle='Zaloguj się do swojego konta mObywatel'
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <AppTypography
              variant='h4'
              component='h1'
              gutterBottom
              textAlign='center'
            >
              Zaloguj się
            </AppTypography>

            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              sx={{ mt: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <AppTypography
                variant='body2'
                color='text.secondary'
                sx={{ mb: 2 }}
              >
                Nie masz jeszcze konta?
              </AppTypography>
              <AppButton
                component={RouterLink}
                to='/register'
                variant='outlined'
                fullWidth
              >
                Zarejestruj się
              </AppButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
}
