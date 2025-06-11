import React from 'react';
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
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import {
  CreditCard,
  DirectionsCar,
  ReportProblem,
  Visibility,
  Photo,
} from '@mui/icons-material';
import { AppTypography } from '../atoms';
import type { Document } from '../pages/CitizenDashboard';

export interface DocumentsOverviewProps {
  documents: Document[];
  onReportLost: (documentId: number) => void;
}

// Custom hook for document photo fetching
const useDocumentPhotoFetch = (documentID: number) => {
  const [photoUrl, setPhotoUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      setError('');

      try {
        // Adjust the API endpoint according to your Spring Boot controller
        // This assumes you have an endpoint for document photos
        const response = await fetch(
            `/api/photo/doc/${documentID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setPhotoUrl(imageUrl);
      } catch (err) {
        console.error('Error fetching document photo:', err);
        setError('Błąd ładowania zdjęcia');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();

    // Cleanup function
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [documentID]);

  return { photoUrl, loading, error };
};

// Photo action component for each document
const DocumentPhotoActions = ({
                                document
                              }: {
  document: Document
}) => {
  const { photoUrl, loading, error } = useDocumentPhotoFetch(
      document.documentID,
      // document.citizenID || 0 // Assuming citizenID is available on document
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleViewPhoto = () => {
    if (photoUrl && !error) {
      setDialogOpen(true);
    }
  };

  const renderPhotoButton = () => {
    if (loading) {
      return (
          <IconButton size='small' disabled>
            <CircularProgress size={16} />
          </IconButton>
      );
    }

    if (error || !photoUrl) {
      return (
          <Tooltip title={error || 'Brak zdjęcia'}>
            <IconButton size='small' disabled>
              <Photo />
            </IconButton>
          </Tooltip>
      );
    }

    return (
        <Tooltip title='Zobacz zdjęcie'>
          <IconButton
              size='small'
              aria-label='Zobacz zdjęcie'
              onClick={handleViewPhoto}
          >
            <Visibility />
          </IconButton>
        </Tooltip>
    );
  };

  return (
      <>
        {renderPhotoButton()}

        {/* Photo preview dialog */}
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="md"
            fullWidth
        >
          <DialogTitle>
            Zdjęcie dokumentu - {document.type === 'IDENTITY_CARD' ? 'Dowód osobisty' : 'Prawo jazdy'}
          </DialogTitle>
          <DialogContent>
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 400,
                }}
            >
              {photoUrl && (
                  <img
                      src={photoUrl}
                      alt={`Zdjęcie dokumentu ${document.documentID}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '500px',
                        objectFit: 'contain',
                      }}
                  />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Zamknij
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
};

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
                              <DocumentPhotoActions document={document} />
                              {!document.lost && (
                                  <Tooltip title='Zgłoś utratę'>
                                    <IconButton
                                        size='small'
                                        color='error'
                                        aria-label='Zgłoś utratę'
                                        onClick={() => onReportLost(document.documentID)}
                                    >
                                      <ReportProblem />
                                    </IconButton>
                                  </Tooltip>
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