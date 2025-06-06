import { useState, useEffect } from 'react';
import { Grid, Fab, Box, Alert, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { PageLayout } from '../organisms';
import {
  DocumentsOverview,
  QuickActions,
  PersonalDataCard,
} from '../organisms';
import {
  DocumentRequestModal,
  PersonalDataRequestModal,
  ReportLostModal,
  type DocumentRequestData,
  type PersonalDataRequestData,
} from '../molecules';
import { API_BASE_URL } from '../../config/api';
import { parseBackendError, logError } from '../../utils/errorUtils';

export interface Document {
  documentID: number;
  photoURL: string;
  issueDate: string;
  expirationDate: string;
  type: 'IDENTITY_CARD' | 'DRIVER_LICENSE';
  lost: boolean;
  // Identity Card specific
  citizenship?: string;
  // Driver License specific
  categories?: string[];
}

export interface CitizenData {
  citizenID: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  PESEL: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
}

export default function CitizenDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [citizenData, setCitizenData] = useState<CitizenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Modal states
  const [documentRequestOpen, setDocumentRequestOpen] = useState(false);
  const [personalDataRequestOpen, setPersonalDataRequestOpen] = useState(false);
  const [reportLostOpen, setReportLostOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/citizen/docs`, {
        credentials: 'include',
      });

      if (response.ok) {
        const docs = await response.json();
        setDocuments(docs);
      } else {
        const errorText = await response.text();
        setError(parseBackendError(errorText).message);
      }
    } catch (err) {
      logError({
        type: 'network_error',
        message: (err as Error)?.message || 'Błąd pobierania dokumentów',
      });
      setError('Błąd połączenia z serwerem');
    }
  };

  const fetchCitizenData = async () => {
    // For now, we'll get this from JWT token or user context
    // In a real app, you might need a separate endpoint to get current user data
    try {
      // This is a placeholder - you might need to add an endpoint to get current citizen data
      // or extract it from the JWT token on the frontend
      setCitizenData({
        citizenID: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        birthDate: '1990-05-15',
        PESEL: '90051512340',
        gender: 'MALE',
        email: 'jan.kowalski@example.com',
      });
    } catch (err) {
      logError({
        type: 'network_error',
        message: (err as Error)?.message || 'Błąd pobierania danych obywatela',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDocuments(), fetchCitizenData()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleDocumentRequest = async (data: DocumentRequestData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/citizen/docs/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess('Wniosek o wydanie dokumentu został złożony pomyślnie');
        setDocumentRequestOpen(false);
        // Refresh documents list
        fetchDocuments();
      } else {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }
    } catch (err) {
      logError({
        type: 'api_error',
        message: (err as Error)?.message || 'Błąd składania wniosku',
      });
      throw err;
    }
  };

  const handlePersonalDataRequest = async (data: PersonalDataRequestData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/citizen/personalData/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setSuccess(
          'Wniosek o zmianę danych osobowych został złożony pomyślnie'
        );
        setPersonalDataRequestOpen(false);
      } else {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }
    } catch (err) {
      logError({
        type: 'api_error',
        message: (err as Error)?.message || 'Błąd składania wniosku',
      });
      throw err;
    }
  };

  const handleReportLost = async (documentId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/citizen/docs/lost?documentID=${documentId}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (response.ok) {
        setSuccess('Zgłoszenie utraty dokumentu zostało przesłane pomyślnie');
        setReportLostOpen(false);
        setSelectedDocumentId(null);
        // Refresh documents list
        fetchDocuments();
      } else {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }
    } catch (err) {
      logError({
        type: 'api_error',
        message: (err as Error)?.message || 'Błąd zgłaszania utraty',
      });
      throw err;
    }
  };

  const openReportLostModal = (documentId: number) => {
    setSelectedDocumentId(documentId);
    setReportLostOpen(true);
  };

  if (loading) {
    return (
      <PageLayout
        title='Panel Obywatela'
        subtitle='Zarządzaj swoimi dokumentami i danymi osobowymi'
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title='Panel Obywatela'
      subtitle='Zarządzaj swoimi dokumentami i danymi osobowymi'
    >
      {success && (
        <Alert severity='success' sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Data Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <PersonalDataCard
            citizenData={citizenData}
            onEditRequest={() => setPersonalDataRequestOpen(true)}
          />
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 8 }}>
          <QuickActions
            onDocumentRequest={() => setDocumentRequestOpen(true)}
            onPersonalDataRequest={() => setPersonalDataRequestOpen(true)}
          />
        </Grid>

        {/* Documents Overview */}
        <Grid size={{ xs: 12 }}>
          <DocumentsOverview
            documents={documents}
            onReportLost={openReportLostModal}
          />
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color='primary'
        aria-label='add document request'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDocumentRequestOpen(true)}
      >
        <Add />
      </Fab>

      {/* Modals */}
      <DocumentRequestModal
        open={documentRequestOpen}
        onClose={() => setDocumentRequestOpen(false)}
        onSubmit={handleDocumentRequest}
        citizenData={citizenData}
      />

      <PersonalDataRequestModal
        open={personalDataRequestOpen}
        onClose={() => setPersonalDataRequestOpen(false)}
        onSubmit={handlePersonalDataRequest}
        currentData={citizenData}
      />

      <ReportLostModal
        open={reportLostOpen}
        onClose={() => {
          setReportLostOpen(false);
          setSelectedDocumentId(null);
        }}
        onConfirm={() =>
          selectedDocumentId && handleReportLost(selectedDocumentId)
        }
        documentId={selectedDocumentId}
      />
    </PageLayout>
  );
}
