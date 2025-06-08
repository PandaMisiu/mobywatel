import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Avatar,
} from '@mui/material';
import {
  CreditCard,
  DirectionsCar,
  ReportProblem,
  Visibility,
} from '@mui/icons-material';
import { AppTypography } from '../atoms';
import type { Document } from '../pages/CitizenDashboard';

export interface DocumentsOverviewProps {
  documents: Document[];
  onReportLost: (documentId: number) => void;
}

export function DocumentsOverview({
  documents,
  onReportLost,
}: DocumentsOverviewProps) {
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'IDENTITY_CARD':
        return <CreditCard />;
      case 'DRIVER_LICENSE':
        return <DirectionsCar />;
      default:
        return <CreditCard />;
    }
  };

  const getDocumentName = (type: Document['type']) => {
    switch (type) {
      case 'IDENTITY_CARD':
        return 'Dowód osobisty';
      case 'DRIVER_LICENSE':
        return 'Prawo jazdy';
      default:
        return 'Nieznany dokument';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0; // Expires in 90 days or less
  };

  const isExpired = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    return expDate < now;
  };

  return (
    <Card>
      <CardContent>
        <AppTypography variant='h5' component='h2' gutterBottom>
          Moje dokumenty
        </AppTypography>

        {documents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <AppTypography variant='body1' color='text.secondary'>
              Brak dokumentów do wyświetlenia.
            </AppTypography>
            <AppTypography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 1 }}
            >
              Złóż wniosek o wydanie nowego dokumentu, aby rozpocząć.
            </AppTypography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Dokument</TableCell>
                  <TableCell>Data wydania</TableCell>
                  <TableCell>Data wygaśnięcia</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Dodatkowe informacje</TableCell>
                  <TableCell align='center'>Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.documentID}>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getDocumentIcon(document.type)}
                        </Avatar>
                        <Box>
                          <AppTypography variant='body2' fontWeight='medium'>
                            {getDocumentName(document.type)}
                          </AppTypography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(document.issueDate)}</TableCell>
                    <TableCell>{formatDate(document.expirationDate)}</TableCell>
                    <TableCell>
                      {document.lost ? (
                        <Chip
                          label='Zgłoszony jako utracony'
                          color='error'
                          variant='outlined'
                          size='small'
                        />
                      ) : isExpired(document.expirationDate) ? (
                        <Chip label='Wygasły' color='error' size='small' />
                      ) : isExpiringSoon(document.expirationDate) ? (
                        <Chip
                          label='Wygasa wkrótce'
                          color='warning'
                          size='small'
                        />
                      ) : (
                        <Chip label='Ważny' color='success' size='small' />
                      )}
                    </TableCell>
                    <TableCell>
                      {document.type === 'IDENTITY_CARD' &&
                        document.citizenship && (
                          <AppTypography variant='body2'>
                            Obywatelstwo: {document.citizenship}
                          </AppTypography>
                        )}
                      {document.type === 'DRIVER_LICENSE' &&
                        document.categories && (
                          <AppTypography variant='body2'>
                            Kategorie: {document.categories.join(', ')}
                          </AppTypography>
                        )}
                    </TableCell>
                    <TableCell align='center'>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {document.photoURL && (
                          <IconButton
                            size='small'
                            aria-label='Zobacz zdjęcie'
                            onClick={() =>
                              window.open(document.photoURL, '_blank')
                            }
                          >
                            <Visibility />
                          </IconButton>
                        )}
                        {!document.lost && (
                          <IconButton
                            size='small'
                            color='error'
                            aria-label='Zgłoś utratę'
                            onClick={() => onReportLost(document.documentID)}
                          >
                            <ReportProblem />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
