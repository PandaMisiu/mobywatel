import React from 'react';
import { Container, Box, Tab, Tabs, Alert, Snackbar } from '@mui/material';
import { AppTypography } from '../atoms';
import { SearchBar } from '../molecules/SearchBar';
import { CitizensTable } from '../molecules/CitizensTable';
import { PersonalDataRequestsTable } from '../molecules/PersonalDataRequestsTable';
import { DocumentRequestsTable } from '../molecules/DocumentRequestsTable';
import { EditCitizenModal } from '../molecules/EditCitizenModal';
import { ViewPersonalDataRequestModal } from '../molecules/ViewPersonalDataRequestModal';
import { ViewDocumentRequestModal } from '../molecules/ViewDocumentRequestModal';
import { ConfirmDeleteDialog } from '../molecules/ConfirmDeleteDialog';
import {
  DashboardStatsCard,
  type DashboardStats,
} from '../organisms/DashboardStatsCard';
import { API_BASE_URL } from '../../config/api';
import { parseBackendError } from '../../utils/errorUtils';
import type {
  CitizenData,
  CitizenUpdateData,
  PersonalDataUpdateRequest,
  DocumentIssueRequest,
  CitizenSearchCriteria,
} from '../../types/official';
import type { SearchFilters } from '../molecules/SearchBar';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function OfficialDashboard() {
  // Tab state
  const [activeTab, setActiveTab] = React.useState(0);

  // Data states
  const [citizens, setCitizens] = React.useState<CitizenData[]>([]);
  const [personalDataRequests, setPersonalDataRequests] = React.useState<
    PersonalDataUpdateRequest[]
  >([]);
  const [documentRequests, setDocumentRequests] = React.useState<
    DocumentIssueRequest[]
  >([]);
  const [dashboardStats, setDashboardStats] =
    React.useState<DashboardStats | null>(null);

  // Loading states
  const [isLoadingCitizens, setIsLoadingCitizens] = React.useState(false);
  const [isLoadingPersonalDataRequests, setIsLoadingPersonalDataRequests] =
    React.useState(false);
  const [isLoadingDocumentRequests, setIsLoadingDocumentRequests] =
    React.useState(false);
  const [isLoadingStats, setIsLoadingStats] = React.useState(false);

  // Modal states
  const [editCitizenModal, setEditCitizenModal] = React.useState<{
    open: boolean;
    citizen: CitizenData | null;
  }>({ open: false, citizen: null });

  const [personalDataRequestModal, setPersonalDataRequestModal] =
    React.useState<{
      open: boolean;
      request: PersonalDataUpdateRequest | null;
    }>({ open: false, request: null });

  const [documentRequestModal, setDocumentRequestModal] = React.useState<{
    open: boolean;
    request: DocumentIssueRequest | null;
  }>({ open: false, request: null });

  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState<{
    open: boolean;
    citizen: CitizenData | null;
  }>({ open: false, citizen: null });

  // Notification states
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  // Search state
  const [searchCriteria, setSearchCriteria] =
    React.useState<CitizenSearchCriteria>({});

  // Load dashboard statistics
  const loadDashboardStats = React.useCallback(async () => {
    setIsLoadingStats(true);
    try {
      // Note: These endpoints would need to be implemented in the backend
      // For now, we'll calculate from the data we have
      const stats: DashboardStats = {
        totalCitizens: citizens.length,
        pendingPersonalDataRequests: personalDataRequests.filter(
          (r) => !r.processed
        ).length,
        pendingDocumentRequests: documentRequests.length, // Assuming all are pending
        approvedPersonalDataRequests: personalDataRequests.filter(
          (r) => r.processed && r.approved
        ).length,
        rejectedPersonalDataRequests: personalDataRequests.filter(
          (r) => r.processed && !r.approved
        ).length,
        approvedDocumentRequests: 0, // Would need backend endpoint
        rejectedDocumentRequests: 0, // Would need backend endpoint
      };
      setDashboardStats(stats);
    } catch {
      // Failed to load dashboard stats - use fallback
      setDashboardStats({
        totalCitizens: 0,
        pendingPersonalDataRequests: 0,
        pendingDocumentRequests: 0,
        approvedPersonalDataRequests: 0,
        rejectedPersonalDataRequests: 0,
        approvedDocumentRequests: 0,
        rejectedDocumentRequests: 0,
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [citizens.length, personalDataRequests, documentRequests.length]);

  // Load citizens data
  const loadCitizens = React.useCallback(
    async (criteria?: CitizenSearchCriteria) => {
      setIsLoadingCitizens(true);
      try {
        let url: string;

        // If searching by specific criteria, use the singular endpoint
        if (criteria?.citizenID || criteria?.PESEL) {
          url = `${API_BASE_URL}/api/official/citizen`;
          const params = new URLSearchParams();

          if (criteria.citizenID) {
            params.append('citizenID', criteria.citizenID.toString());
          }
          if (criteria.PESEL) {
            params.append('PESEL', criteria.PESEL);
          }

          url += `?${params.toString()}`;
        } else {
          // If no criteria, load all citizens
          url = `${API_BASE_URL}/api/official/citizens`;
        }

        const response = await fetch(url, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCitizens(Array.isArray(data) ? data : [data]);
        } else {
          const errorText = await response.text();
          const parsed = parseBackendError(errorText);
          showNotification(parsed.message, 'error');
          setCitizens([]);
        }
      } catch (error) {
        const parsed = parseBackendError((error as Error)?.message || '');
        showNotification(parsed.message, 'error');
        setCitizens([]);
      } finally {
        setIsLoadingCitizens(false);
      }
    },
    []
  );

  // Load personal data requests
  const loadPersonalDataRequests = React.useCallback(async () => {
    setIsLoadingPersonalDataRequests(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/official/citizen/personalData/requests`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPersonalDataRequests(data);
      } else {
        const errorText = await response.text();
        const parsed = parseBackendError(errorText);
        showNotification(parsed.message, 'error');
        setPersonalDataRequests([]);
      }
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
      setPersonalDataRequests([]);
    } finally {
      setIsLoadingPersonalDataRequests(false);
    }
  }, []);

  // Load document requests
  const loadDocumentRequests = React.useCallback(async () => {
    setIsLoadingDocumentRequests(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/official/citizen/docs/requests`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocumentRequests(data);
      } else {
        const errorText = await response.text();
        const parsed = parseBackendError(errorText);
        showNotification(parsed.message, 'error');
        setDocumentRequests([]);
      }
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
      setDocumentRequests([]);
    } finally {
      setIsLoadingDocumentRequests(false);
    }
  }, []);

  // Show notification
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({ open: true, message, severity });
  };

  // Handle citizen search
  const handleSearch = (filters: SearchFilters) => {
    const criteria: CitizenSearchCriteria = {};

    // Only set criteria based on the specific search type
    if (filters.searchType === 'citizenID' && filters.citizenID) {
      criteria.citizenID = parseInt(filters.citizenID, 10);
    } else if (filters.searchType === 'PESEL' && filters.PESEL) {
      criteria.PESEL = filters.PESEL;
    }
    // For 'all' search type, don't set any criteria to load all citizens

    setSearchCriteria(criteria);
    loadCitizens(criteria);
  };

  // Handle citizen actions
  const handleViewCitizen = (citizen: CitizenData) => {
    setEditCitizenModal({ open: true, citizen });
  };

  const handleEditCitizen = (citizen: CitizenData) => {
    setEditCitizenModal({ open: true, citizen });
  };

  const handleDeleteCitizen = (citizenID: number) => {
    const citizen = citizens.find((c) => c.citizenID === citizenID);
    if (citizen) {
      setDeleteConfirmModal({ open: true, citizen });
    }
  };

  const handleUpdateCitizen = async (data: CitizenUpdateData) => {
    const response = await fetch(`${API_BASE_URL}/api/official/citizen`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    showNotification('Dane obywatela zostały zaktualizowane', 'success');
    loadCitizens(searchCriteria);
    loadDashboardStats();
  };

  const handleConfirmDeleteCitizen = async () => {
    if (!deleteConfirmModal.citizen) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/official/citizen?citizenID=${deleteConfirmModal.citizen.citizenID}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      showNotification('Konto obywatela zostało usunięte', 'success');
      loadCitizens(searchCriteria);
      loadPersonalDataRequests();
      loadDocumentRequests();
      loadDashboardStats();
      setDeleteConfirmModal({ open: false, citizen: null });
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
    }
  };

  // Handle personal data request actions
  const handleViewPersonalDataRequest = (
    request: PersonalDataUpdateRequest
  ) => {
    setPersonalDataRequestModal({ open: true, request });
  };

  const handleApprovePersonalDataRequest = async (requestID: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/official/citizen/personalData/request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestID: requestID,
          approval: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Wniosek został zatwierdzony', 'success');
    loadPersonalDataRequests();
    loadDashboardStats();
  };

  const handleRejectPersonalDataRequest = async (requestID: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/official/citizen/personalData/request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestID: requestID,
          approval: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Wniosek został odrzucony', 'success');
    loadPersonalDataRequests();
    loadDashboardStats();
  };

  // Handle document request actions
  const handleViewDocumentRequest = (request: DocumentIssueRequest) => {
    setDocumentRequestModal({ open: true, request });
  };

  const handleApproveDocumentRequest = async (requestID: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/official/citizen/docs/request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestID: requestID,
          approval: true,
          expirationDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0], // Default 10 years
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Dokument został zatwierdzony do wydania', 'success');
    loadDocumentRequests();
    loadDashboardStats();
  };

  const handleRejectDocumentRequest = async (requestID: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/official/citizen/docs/request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestID: requestID,
          approval: false,
          expirationDate: null, // Not needed for rejection
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Wniosek o wydanie dokumentu został odrzucony', 'success');
    loadDocumentRequests();
    loadDashboardStats();
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Load initial data
  React.useEffect(() => {
    loadCitizens();
    loadPersonalDataRequests();
    loadDocumentRequests();
  }, [loadCitizens, loadPersonalDataRequests, loadDocumentRequests]);

  // Update dashboard stats when data changes
  React.useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <AppTypography variant='h4' gutterBottom>
        Panel Urzędnika
      </AppTypography>

      <DashboardStatsCard stats={dashboardStats} isLoading={isLoadingStats} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label='Zarządzanie obywatelami' />
          <Tab label='Wnioski o zmianę danych' />
          <Tab label='Wnioski o wydanie dokumentów' />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <SearchBar onSearch={handleSearch} />
        <CitizensTable
          citizens={citizens}
          loading={isLoadingCitizens}
          onView={handleViewCitizen}
          onEdit={handleEditCitizen}
          onDelete={handleDeleteCitizen}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <PersonalDataRequestsTable
          requests={personalDataRequests}
          loading={isLoadingPersonalDataRequests}
          onView={handleViewPersonalDataRequest}
          onApprove={handleApprovePersonalDataRequest}
          onReject={handleRejectPersonalDataRequest}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <DocumentRequestsTable
          requests={documentRequests}
          loading={isLoadingDocumentRequests}
          onView={handleViewDocumentRequest}
          onApprove={handleApproveDocumentRequest}
          onReject={handleRejectDocumentRequest}
        />
      </TabPanel>

      {/* Modals */}
      <EditCitizenModal
        open={editCitizenModal.open}
        onClose={() => setEditCitizenModal({ open: false, citizen: null })}
        onSubmit={handleUpdateCitizen}
        citizenData={editCitizenModal.citizen}
      />

      <ViewPersonalDataRequestModal
        open={personalDataRequestModal.open}
        onClose={() =>
          setPersonalDataRequestModal({ open: false, request: null })
        }
        onApprove={handleApprovePersonalDataRequest}
        onReject={handleRejectPersonalDataRequest}
        request={personalDataRequestModal.request}
      />

      <ViewDocumentRequestModal
        open={documentRequestModal.open}
        onClose={() => setDocumentRequestModal({ open: false, request: null })}
        onApprove={handleApproveDocumentRequest}
        onReject={handleRejectDocumentRequest}
        request={documentRequestModal.request}
      />

      <ConfirmDeleteDialog
        open={deleteConfirmModal.open}
        onClose={() => setDeleteConfirmModal({ open: false, citizen: null })}
        onConfirm={handleConfirmDeleteCitizen}
        title='Usuń konto obywatela'
        message={`Czy na pewno chcesz usunąć konto obywatela ${deleteConfirmModal.citizen?.firstName} ${deleteConfirmModal.citizen?.lastName}?`}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default OfficialDashboard;
