import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';
import { parseBackendError } from '../../utils/errorUtils';
import type { PersonalDataUpdateRequest } from '../../types/official';

export interface ViewPersonalDataRequestModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: (requestID: number) => Promise<void>;
  onReject: (requestID: number) => Promise<void>;
  request: PersonalDataUpdateRequest | null;
}

export function ViewPersonalDataRequestModal({
  open,
  onClose,
  onApprove,
  onReject,
  request,
}: ViewPersonalDataRequestModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleApprove = async () => {
    if (!request) return;

    setIsLoading(true);
    setError('');

    try {
      await onApprove(request.requestID);
      onClose();
    } catch (err) {
      const parsed = parseBackendError((err as Error)?.message || '');
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;

    setIsLoading(true);
    setError('');

    try {
      await onReject(request.requestID);
      onClose();
    } catch (err) {
      const parsed = parseBackendError((err as Error)?.message || '');
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const genderLabel = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'Mężczyzna' : 'Kobieta';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Wniosek o zmianę danych osobowych #{request.requestID}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <AppTypography variant='subtitle2' color='text.secondary'>
                Informacje o wniosku
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <AppTypography variant='body2' fontWeight='bold'>
                ID Obywatela:
              </AppTypography>
              <AppTypography variant='body2'>{request.citizenID}</AppTypography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <AppTypography variant='body2' fontWeight='bold'>
                Data złożenia:
              </AppTypography>
              <AppTypography variant='body2'>
                {formatDate(request.requestDate)}
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <AppTypography variant='subtitle2' color='text.secondary'>
                Żądane zmiany
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <AppTypography variant='body2' fontWeight='bold'>
                Nowe imię:
              </AppTypography>
              <AppTypography variant='body2'>
                {request.requestedFirstName}
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <AppTypography variant='body2' fontWeight='bold'>
                Nowe nazwisko:
              </AppTypography>
              <AppTypography variant='body2'>
                {request.requestedLastName}
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <AppTypography variant='body2' fontWeight='bold'>
                Nowa płeć:
              </AppTypography>
              <AppTypography variant='body2'>
                {genderLabel(request.requestedGender)}
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <AppTypography variant='body2' fontWeight='bold'>
                Status:
              </AppTypography>
              <AppTypography
                variant='body2'
                color={
                  request.processed
                    ? request.approved
                      ? 'success.main'
                      : 'error.main'
                    : 'warning.main'
                }
              >
                {request.processed
                  ? request.approved
                    ? 'Zatwierdzony'
                    : 'Odrzucony'
                  : 'Oczekuje na rozpatrzenie'}
              </AppTypography>
            </Grid>
          </Grid>

          {!request.processed && (
            <Alert severity='info' sx={{ mt: 3 }}>
              <AppTypography variant='body2'>
                <strong>Uwaga:</strong> Po zatwierdzeniu tego wniosku, dane
                obywatela zostaną automatycznie zaktualizowane w systemie. Ta
                operacja jest nieodwracalna.
              </AppTypography>
            </Alert>
          )}

          {request.processed && (
            <Alert
              severity={request.approved ? 'success' : 'error'}
              sx={{ mt: 3 }}
            >
              <AppTypography variant='body2'>
                Wniosek został już rozpatrzony dnia{' '}
                <strong>{formatDate(request.requestDate)}</strong>.
              </AppTypography>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={handleClose}>
          {request.processed ? 'Zamknij' : 'Anuluj'}
        </AppButton>

        {!request.processed && (
          <>
            <AppButton
              onClick={handleReject}
              disabled={isLoading}
              color='error'
            >
              {isLoading ? 'Przetwarzanie...' : 'Odrzuć'}
            </AppButton>
            <AppButton
              onClick={handleApprove}
              variant='contained'
              disabled={isLoading}
            >
              {isLoading ? 'Przetwarzanie...' : 'Zatwierdź'}
            </AppButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
