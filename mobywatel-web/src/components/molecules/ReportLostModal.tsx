import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
} from '@mui/material';
import { ReportProblem } from '@mui/icons-material';
import { AppButton, AppTypography } from '../atoms';

export interface ReportLostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentId: number | null;
}

export function ReportLostModal({
  open,
  onClose,
  onConfirm,
}: ReportLostModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportProblem color='error' />
        Zgłoszenie utraty dokumentu
      </DialogTitle>

      <DialogContent>
        <Alert severity='warning' sx={{ mb: 2 }}>
          <AppTypography variant='body2'>
            <strong>Uwaga:</strong> Zgłoszenie utraty dokumentu jest
            nieodwracalne.
          </AppTypography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <AppTypography variant='body1' gutterBottom>
            Czy na pewno chcesz zgłosić utratę tego dokumentu?
          </AppTypography>

          <AppTypography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Po zgłoszeniu utraty:
          </AppTypography>
          <Box component='ul' sx={{ mt: 1, pl: 2 }}>
            <li>
              <AppTypography variant='body2' color='text.secondary'>
                Dokument zostanie oznaczony jako utracony w systemie
              </AppTypography>
            </li>
            <li>
              <AppTypography variant='body2' color='text.secondary'>
                Nie będzie można cofnąć tej operacji
              </AppTypography>
            </li>
            <li>
              <AppTypography variant='body2' color='text.secondary'>
                Będziesz mógł złożyć wniosek o wydanie nowego dokumentu
              </AppTypography>
            </li>
            <li>
              <AppTypography variant='body2' color='text.secondary'>
                Zgłoszenie zostanie przekazane do odpowiednich służb
              </AppTypography>
            </li>
          </Box>
        </Box>

        <Alert severity='info' sx={{ mt: 2 }}>
          <AppTypography variant='body2'>
            W przypadku odnalezienia dokumentu, skontaktuj się z urzędem w celu
            zaktualizowania statusu.
          </AppTypography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={onClose}>Anuluj</AppButton>
        <AppButton
          onClick={onConfirm}
          variant='contained'
          color='error'
          startIcon={<ReportProblem />}
        >
          Zgłoś utratę
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
