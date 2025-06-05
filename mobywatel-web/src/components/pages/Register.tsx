import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Divider, Alert } from '@mui/material';
import { PageLayout } from '../organisms';
import { RegisterForm } from '../molecules';
import type { RegisterFormData } from '../molecules/RegisterForm';
import { AppTypography, AppButton } from '../atoms';
import { API_BASE_URL } from '../../config/api';
import { parseBackendError, logError } from '../../utils/errorUtils';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Success response - should be JSON with success flag
        const result = await response.json();
        if (result.successful) {
          setSuccess(true);
          // Redirect to login page after successful registration
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(result.message || 'Błąd podczas rejestracji');
        }
      } else {
        // Error response - could be JSON or plain text
        let errorMessage = 'Błąd podczas rejestracji';

        // Clone the response to be able to read it twice
        const responseClone = response.clone();

        try {
          // Try to parse as JSON first
          const result = await response.json();
          errorMessage = result.message || errorMessage;
        } catch {
          // If JSON parsing fails, treat as plain text using the cloned response
          try {
            const textResponse = await responseClone.text();
            if (textResponse) {
              // Backend returns "Bad request: actual_error_message", extract the actual message
              if (textResponse.startsWith('Bad request: ')) {
                errorMessage = textResponse.replace('Bad request: ', '');
              } else {
                errorMessage = textResponse;
              }
            }
          } catch (textError) {
            // If both JSON and text parsing fail, use default message
            logError({
              type: 'api_error',
              message: 'Failed to parse error response',
              context: { textError },
            });
          }
        }

        setError(parseBackendError(errorMessage).message);
        logError({
          type: 'api_error',
          message: errorMessage,
          context: {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          },
        });
      }
    } catch (err) {
      logError({
        type: 'network_error',
        message: (err as Error)?.message || 'Błąd połączenia z serwerem',
        context: {
          name: (err as Error)?.name,
          stack: (err as Error)?.stack,
        },
      });
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title='Rejestracja' subtitle='Utwórz nowe konto mObywatel'>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <AppTypography
              variant='h4'
              component='h1'
              gutterBottom
              textAlign='center'
            >
              Zarejestruj się
            </AppTypography>

            {success && (
              <Alert severity='success' sx={{ mb: 3 }}>
                Rejestracja przebiegła pomyślnie! Przekierowywanie do strony
                logowania...
              </Alert>
            )}

            <RegisterForm
              onSubmit={handleRegister}
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
                Masz już konto?
              </AppTypography>
              <AppButton
                component={RouterLink}
                to='/login'
                variant='outlined'
                fullWidth
              >
                Zaloguj się
              </AppButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
}
