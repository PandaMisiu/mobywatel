import React from 'react';
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
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
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

// Custom hook for photo fetching
const usePhotoFetch = (requestID: number, citizenID: number) => {
    const [photoUrl, setPhotoUrl] = React.useState<string>('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        const fetchPhoto = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(
                    `/api/photo/request/${requestID}?citizenID=${citizenID}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            // Add auth headers if needed
                            // 'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setPhotoUrl(imageUrl);
            } catch (err) {
                console.error('Error fetching photo:', err);
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
    }, [requestID, citizenID]);

    return { photoUrl, loading, error };
};

// Photo cell component
const PhotoCell = ({ request }: { request: DocumentIssueRequest }) => {
    const { photoUrl, loading, error } = usePhotoFetch(request.requestID, request.citizenID);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleViewPhoto = () => {
        if (photoUrl && !error) {
            setDialogOpen(true);
        }
    };

    const renderAvatar = () => {
        if (loading) {
            return (
                <Avatar sx={{ width: 40, height: 40 }}>
                    <CircularProgress size={20} />
                </Avatar>
            );
        }

        if (error || !photoUrl) {
            return (
                <Avatar sx={{ width: 40, height: 40 }}>
                    <Photo />
                </Avatar>
            );
        }

        return (
            <Avatar
                src={photoUrl}
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={handleViewPhoto}
            />
        );
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {renderAvatar()}
                <Tooltip title={error ? error : photoUrl ? 'Kliknij aby powiększyć' : 'Brak zdjęcia'}>
                    <IconButton
                        size='small'
                        onClick={handleViewPhoto}
                        disabled={loading || !!error || !photoUrl}
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Photo preview dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Zdjęcie obywatela - ID: {request.citizenID}
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
                                alt={`Zdjęcie obywatela ${request.citizenID}`}
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
                                <PhotoCell request={request} />
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