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
  TextField,
  Avatar,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';
import { parseBackendError } from '../../utils/errorUtils';
import type { DocumentIssueRequest } from '../../types/official';

export interface ViewDocumentRequestModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: (requestID: number, expirationDate: string) => Promise<void>;
  onReject: (requestID: number) => Promise<void>;
  request: DocumentIssueRequest | null;
}

export function ViewDocumentRequestModal({
  open,
  onClose,
  onApprove,
  onReject,
  request,
}: ViewDocumentRequestModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [expirationDate, setExpirationDate] = React.useState<string>('');

  // Set default expiration date when modal opens
  React.useEffect(() => {
    if (open && request) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10); // 10 years from now
      setExpirationDate(futureDate.toISOString().split('T')[0]);
    }
  }, [open, request]);

  const handleApprove = async () => {
    if (!request || !expirationDate) return;

    setIsLoading(true);
    setError('');

    try {
      await onApprove(request.requestID, expirationDate);
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
    setExpirationDate('');
    onClose();
  };

  if (!request) return null;

  const getDocumentTypeLabel = (type: 'IDENTITY_CARD' | 'DRIVER_LICENSE') => {
    switch (type) {
      case 'IDENTITY_CARD':
        return 'Dowód osobisty';
      case 'DRIVER_LICENSE':
        return 'Prawo jazdy';
      default:
        return type;
    }
  };

  const formatCategories = (categories?: string[]) => {
    if (!categories || categories.length === 0) return 'Brak';
    return categories.join(', ');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Wniosek o wydanie dokumentu #{request.requestID}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
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
                Typ dokumentu:
              </AppTypography>
              <AppTypography variant='body2'>
                {getDocumentTypeLabel(request.type)}
              </AppTypography>
            </Grid>

            {request.type === 'IDENTITY_CARD' && request.citizenship && (
              <Grid size={{ xs: 6 }}>
                <AppTypography variant='body2' fontWeight='bold'>
                  Obywatelstwo:
                </AppTypography>
                <AppTypography variant='body2'>
                  {request.citizenship}
                </AppTypography>
              </Grid>
            )}

            {request.type === 'DRIVER_LICENSE' && (
              <Grid size={{ xs: 6 }}>
                <AppTypography variant='body2' fontWeight='bold'>
                  Kategorie:
                </AppTypography>
                <AppTypography variant='body2'>
                  {formatCategories(request.categories)}
                </AppTypography>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <AppTypography variant='subtitle2' color='text.secondary'>
                Zdjęcie obywatela
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                {request.photoURL ? (
                  <Avatar
                    src={request.photoURL}
                    alt='Zdjęcie obywatela'
                    sx={{ width: 150, height: 150 }}
                  />
                ) : (
                  <AppTypography variant='body2' color='text.secondary'>
                    Brak zdjęcia
                  </AppTypography>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <AppTypography variant='subtitle2' color='text.secondary'>
                Parametry zatwierdzenia
              </AppTypography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label='Data wygaśnięcia dokumentu'
                type='date'
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText='Wybierz datę wygaśnięcia dla nowego dokumentu'
                inputProps={{
                  min: new Date().toISOString().split('T')[0], // Can't expire in the past
                }}
              />
            </Grid>
          </Grid>

          <Alert severity='info' sx={{ mt: 3 }}>
            <AppTypography variant='body2'>
              <strong>Uwaga:</strong> Po zatwierdzeniu tego wniosku, dokument
              zostanie automatycznie wydany obywatelowi. Sprawdź dokładnie
              wszystkie dane przed zatwierdzeniem.
            </AppTypography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={handleClose}>Anuluj</AppButton>

        <AppButton onClick={handleReject} disabled={isLoading} color='error'>
          {isLoading ? 'Przetwarzanie...' : 'Odrzuć'}
        </AppButton>

        <AppButton
          onClick={handleApprove}
          variant='contained'
          disabled={isLoading || !expirationDate}
        >
          {isLoading ? 'Przetwarzanie...' : 'Zatwierdź'}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
