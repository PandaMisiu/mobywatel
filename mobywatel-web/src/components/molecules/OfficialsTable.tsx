import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Skeleton,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { AppTypography } from '../atoms';
import type { OfficialData } from '../../types/admin';

export interface OfficialsTableProps {
  officials: OfficialData[];
  loading?: boolean;
  onView?: (official: OfficialData) => void;
  onEdit?: (official: OfficialData) => void;
  onDelete?: (officialID: number) => void;
}

export function OfficialsTable({
  officials,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: OfficialsTableProps) {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Imię</TableCell>
                <TableCell>Nazwisko</TableCell>
                <TableCell>Stanowisko</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant='text' width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={120} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (officials.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <AppTypography variant='h6' color='text.secondary'>
          Brak urzędników do wyświetlenia
        </AppTypography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <AppTypography variant='subtitle2' fontWeight='bold'>
                  ID
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='subtitle2' fontWeight='bold'>
                  Imię
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='subtitle2' fontWeight='bold'>
                  Nazwisko
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='subtitle2' fontWeight='bold'>
                  Stanowisko
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='subtitle2' fontWeight='bold'>
                  Email
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='subtitle2' fontWeight='bold'>
                  Akcje
                </AppTypography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {officials.map((official) => (
              <TableRow key={official.officialID} hover>
                <TableCell>
                  <Chip
                    label={official.officialID}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                </TableCell>
                <TableCell>
                  <AppTypography variant='body2'>
                    {official.firstName}
                  </AppTypography>
                </TableCell>
                <TableCell>
                  <AppTypography variant='body2'>
                    {official.lastName}
                  </AppTypography>
                </TableCell>
                <TableCell>
                  <AppTypography variant='body2'>
                    {official.position}
                  </AppTypography>
                </TableCell>
                <TableCell>
                  <AppTypography variant='body2' color='text.secondary'>
                    {official.email}
                  </AppTypography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {onView && (
                      <IconButton
                        size='small'
                        onClick={() => onView(official)}
                        aria-label={`Wyświetl urzędnika ${official.firstName} ${official.lastName}`}
                      >
                        <Visibility fontSize='small' />
                      </IconButton>
                    )}
                    {onEdit && (
                      <IconButton
                        size='small'
                        onClick={() => onEdit(official)}
                        aria-label={`Edytuj urzędnika ${official.firstName} ${official.lastName}`}
                      >
                        <Edit fontSize='small' />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => onDelete(official.officialID)}
                        aria-label={`Usuń urzędnika ${official.firstName} ${official.lastName}`}
                      >
                        <Delete fontSize='small' />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
