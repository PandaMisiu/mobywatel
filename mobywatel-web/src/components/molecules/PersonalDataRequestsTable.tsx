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
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import { AppTypography } from '../atoms';
import type { PersonalDataUpdateRequest } from '../../types/official';

export interface PersonalDataRequestsTableProps {
  requests: PersonalDataUpdateRequest[];
  loading?: boolean;
  onView: (request: PersonalDataUpdateRequest) => void;
  onApprove: (requestID: number) => void;
  onReject: (requestID: number) => void;
}

export function PersonalDataRequestsTable({
  requests,
  loading = false,
  onView,
  onApprove,
  onReject,
}: PersonalDataRequestsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const getGenderLabel = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'Mężczyzna' : 'Kobieta';
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <AppTypography variant='body1' color='text.secondary'>
          Ładowanie żądań zmiany danych osobowych...
        </AppTypography>
      </Paper>
    );
  }

  if (requests.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <AppTypography variant='body1' color='text.secondary'>
          Brak oczekujących żądań zmiany danych osobowych.
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
            <TableCell>Nowe imię</TableCell>
            <TableCell>Nowe nazwisko</TableCell>
            <TableCell>Nowa płeć</TableCell>
            <TableCell>Data żądania</TableCell>
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
                <AppTypography variant='body2'>
                  {request.requestedFirstName}
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='body2'>
                  {request.requestedLastName}
                </AppTypography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getGenderLabel(request.requestedGender)}
                  color={
                    request.requestedGender === 'MALE' ? 'primary' : 'secondary'
                  }
                  size='small'
                />
              </TableCell>
              <TableCell>
                <AppTypography variant='body2'>
                  {formatDate(request.requestDate)}
                </AppTypography>
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
