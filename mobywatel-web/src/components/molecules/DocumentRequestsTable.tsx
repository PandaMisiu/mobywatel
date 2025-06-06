import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Avatar,
} from '@mui/material';
import { CheckCircle, Cancel, Visibility, Photo } from '@mui/icons-material';
import { AppTypography } from '../atoms';
import type { DocumentIssueRequest } from '../../types/official';

export interface DocumentRequestsTableProps {
  requests: DocumentIssueRequest[];
  loading?: boolean;
  onView: (request: DocumentIssueRequest) => void;
  onApprove: (requestID: number) => void;
  onReject: (requestID: number) => void;
}

export function DocumentRequestsTable({
  requests,
  loading = false,
  onView,
  onApprove,
  onReject,
}: DocumentRequestsTableProps) {
  const getDocumentTypeLabel = (type: 'IDENTITY_CARD' | 'DRIVER_LICENSE') => {
    return type === 'IDENTITY_CARD' ? 'Dowód osobisty' : 'Prawo jazdy';
  };

  const getDocumentTypeColor = (type: 'IDENTITY_CARD' | 'DRIVER_LICENSE') => {
    return type === 'IDENTITY_CARD' ? 'primary' : 'secondary';
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <AppTypography variant='body1' color='text.secondary'>
          Ładowanie żądań wydania dokumentów...
        </AppTypography>
      </Paper>
    );
  }

  if (requests.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <AppTypography variant='body1' color='text.secondary'>
          Brak oczekujących żądań wydania dokumentów.
        </AppTypography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID Żądania</TableCell>
            <TableCell>ID Obywatela</TableCell>
            <TableCell>Typ dokumentu</TableCell>
            <TableCell>Zdjęcie</TableCell>
            <TableCell>Szczegóły</TableCell>
            <TableCell align='center'>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.requestID}>
              <TableCell>
                <AppTypography variant='body2' fontFamily='monospace'>
                  {request.requestID}
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='body2' fontFamily='monospace'>
                  {request.citizenID}
                </AppTypography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getDocumentTypeLabel(request.type)}
                  color={getDocumentTypeColor(request.type)}
                  size='small'
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {request.photoURL ? (
                    <Avatar
                      src={request.photoURL}
                      sx={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 40, height: 40 }}>
                      <Photo />
                    </Avatar>
                  )}
                  <IconButton
                    size='small'
                    href={request.photoURL}
                    target='_blank'
                    rel='noopener noreferrer'
                    disabled={!request.photoURL}
                  >
                    <Visibility />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                {request.type === 'IDENTITY_CARD' && request.citizenship && (
                  <AppTypography variant='body2'>
                    Obywatelstwo: {request.citizenship}
                  </AppTypography>
                )}
                {request.type === 'DRIVER_LICENSE' && request.categories && (
                  <Box>
                    <AppTypography variant='body2' gutterBottom>
                      Kategorie:
                    </AppTypography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {request.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size='small'
                          variant='outlined'
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </TableCell>
              <TableCell align='center'>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title='Podgląd'>
                    <IconButton
                      size='small'
                      onClick={() => onView(request)}
                      color='info'
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Zatwierdź'>
                    <IconButton
                      size='small'
                      onClick={() => onApprove(request.requestID)}
                      color='success'
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Odrzuć'>
                    <IconButton
                      size='small'
                      onClick={() => onReject(request.requestID)}
                      color='error'
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
