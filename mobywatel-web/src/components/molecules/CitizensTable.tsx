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
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { AppTypography } from '../atoms';
import type { CitizenData } from '../../types/official';

export interface CitizensTableProps {
  citizens: CitizenData[];
  loading?: boolean;
  onView: (citizen: CitizenData) => void;
  onEdit: (citizen: CitizenData) => void;
  onDelete: (citizenID: number) => void;
}

export function CitizensTable({
  citizens,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: CitizensTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const getGenderLabel = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'M' : 'K';
  };

  const getGenderColor = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'primary' : 'secondary';
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <AppTypography variant='body1' color='text.secondary'>
          Ładowanie danych obywateli...
        </AppTypography>
      </Paper>
    );
  }

  if (citizens.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <AppTypography variant='body1' color='text.secondary'>
          Nie znaleziono obywateli spełniających kryteria wyszukiwania.
        </AppTypography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Imię i nazwisko</TableCell>
            <TableCell>PESEL</TableCell>
            <TableCell>Data urodzenia</TableCell>
            <TableCell>Płeć</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align='center'>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citizens.map((citizen) => (
            <TableRow key={citizen.citizenID}>
              <TableCell>
                <AppTypography variant='body2' fontFamily='monospace'>
                  {citizen.citizenID}
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='body2'>
                  {citizen.firstName} {citizen.lastName}
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='body2' fontFamily='monospace'>
                  {citizen.PESEL}
                </AppTypography>
              </TableCell>
              <TableCell>
                <AppTypography variant='body2'>
                  {formatDate(citizen.birthDate)}
                </AppTypography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getGenderLabel(citizen.gender)}
                  color={getGenderColor(citizen.gender)}
                  size='small'
                />
              </TableCell>
              <TableCell>
                <AppTypography variant='body2'>{citizen.email}</AppTypography>
              </TableCell>
              <TableCell align='center'>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title='Podgląd'>
                    <IconButton
                      size='small'
                      onClick={() => onView(citizen)}
                      color='info'
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Edytuj'>
                    <IconButton
                      size='small'
                      onClick={() => onEdit(citizen)}
                      color='primary'
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Usuń'>
                    <IconButton
                      size='small'
                      onClick={() => onDelete(citizen.citizenID)}
                      color='error'
                    >
                      <Delete />
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
