import React, { Component, type ReactNode } from 'react';
import { Box, Card, CardContent, Alert } from '@mui/material';
import { AppTypography, AppButton } from '../atoms';
import { ErrorOutline, Refresh } from '@mui/icons-material';
import { logError } from '../../utils/errorUtils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError({
      type: 'form_error',
      message: `React Error Boundary: ${error.message}`,
      context: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            p: 2,
          }}
        >
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ErrorOutline
                sx={{
                  fontSize: 64,
                  color: 'error.main',
                  mb: 2,
                }}
              />
              <AppTypography variant='h5' component='h2' gutterBottom>
                Wystąpił nieoczekiwany błąd
              </AppTypography>
              <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
                <AppTypography variant='body2'>
                  {this.state.error?.message ||
                    'Coś poszło nie tak. Spróbuj odświeżyć stronę.'}
                </AppTypography>
              </Alert>
              <AppButton
                variant='contained'
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                sx={{ mr: 2 }}
              >
                Spróbuj ponownie
              </AppButton>
              <AppButton
                variant='outlined'
                onClick={() => window.location.reload()}
              >
                Odśwież stronę
              </AppButton>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
