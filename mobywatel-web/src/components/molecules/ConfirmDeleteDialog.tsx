import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { AppButton, AppTypography } from '../atoms';

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Usuń',
  cancelText = 'Anuluj',
}: ConfirmDeleteDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handling will be managed by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Alert severity='warning' sx={{ mb: 2 }}>
          <AppTypography variant='body2'>{message}</AppTypography>
        </Alert>

        <AppTypography variant='body2' color='text.secondary'>
          <strong>Uwaga:</strong> Ta operacja jest nieodwracalna.
        </AppTypography>
      </DialogContent>

      <DialogActions>
        <AppButton onClick={handleClose} disabled={isLoading}>
          {cancelText}
        </AppButton>

        <AppButton
          onClick={handleConfirm}
          variant='contained'
          color='error'
          disabled={isLoading}
        >
          {isLoading ? 'Usuwanie...' : confirmText}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
