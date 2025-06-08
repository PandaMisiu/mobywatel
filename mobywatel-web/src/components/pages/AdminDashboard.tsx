import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { PageLayout, DashboardStatsCard } from '../organisms';
import { OfficialsTable } from '../molecules/OfficialsTable';
import { CitizensTable } from '../molecules/CitizensTable';
import { EditOfficialModal } from '../molecules/EditOfficialModal';
import { CreateOfficialModal } from '../molecules/CreateOfficialModal';
import { EditCitizenModal } from '../molecules/EditCitizenModal';
import { AppButton, AppTypography } from '../atoms';
import { API_BASE_URL } from '../../config/api';
import { parseBackendError, logError } from '../../utils/errorUtils';
import type {
  OfficialData,
  OfficialCreateData,
  OfficialUpdateData,
  AdminDashboardStats,
} from '../../types/admin';
import type { CitizenData, CitizenUpdateData } from '../../types/official';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function AdminDashboard() {
  // Tab state
  const [activeTab, setActiveTab] = React.useState(0);

  // Data states
  const [officials, setOfficials] = React.useState<OfficialData[]>([]);
  const [citizens, setCitizens] = React.useState<CitizenData[]>([]);
  const [dashboardStats, setDashboardStats] =
    React.useState<AdminDashboardStats | null>(null);

  // Loading states
  const [isLoadingOfficials, setIsLoadingOfficials] = React.useState(false);
  const [isLoadingCitizens, setIsLoadingCitizens] = React.useState(false);
  const [isLoadingStats, setIsLoadingStats] = React.useState(false);

  // Modal states
  const [createOfficialModal, setCreateOfficialModal] = React.useState(false);
  const [editOfficialModal, setEditOfficialModal] = React.useState<{
    open: boolean;
    official: OfficialData | null;
  }>({ open: false, official: null });
  const [editCitizenModal, setEditCitizenModal] = React.useState<{
    open: boolean;
    citizen: CitizenData | null;
  }>({ open: false, citizen: null });
  const [deleteOfficialModal, setDeleteOfficialModal] = React.useState<{
    open: boolean;
    official: OfficialData | null;
  }>({ open: false, official: null });
  const [deleteCitizenModal, setDeleteCitizenModal] = React.useState<{
    open: boolean;
    citizen: CitizenData | null;
  }>({ open: false, citizen: null });

  // Notification state
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    setNotification({ open: true, message, severity });
  };

  // Load data functions
  const loadOfficials = async () => {
    setIsLoadingOfficials(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/officials`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOfficials(data);
      } else {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
      logError({
        type: 'api_error',
        message: (error as Error)?.message || 'Błąd ładowania urzędników',
      });
    } finally {
      setIsLoadingOfficials(false);
    }
  };

  const loadCitizens = async () => {
    setIsLoadingCitizens(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/official/citizens`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCitizens(data);
      } else {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
      logError({
        type: 'api_error',
        message: (error as Error)?.message || 'Błąd ładowania obywateli',
      });
    } finally {
      setIsLoadingCitizens(false);
    }
  };

  const loadDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      // For now, we'll calculate stats from the data we have
      // In the future, you could add a dedicated admin stats endpoint
      const stats: AdminDashboardStats = {
        totalOfficials: officials.length,
        totalCitizens: citizens.length,
        pendingPersonalDataRequests: 0, // Would need separate API call
        pendingDocumentRequests: 0, // Would need separate API call
        approvedPersonalDataRequests: 0,
        rejectedPersonalDataRequests: 0,
        approvedDocumentRequests: 0,
        rejectedDocumentRequests: 0,
      };
      setDashboardStats(stats);
    } catch (error) {
      logError({
        type: 'api_error',
        message: (error as Error)?.message || 'Błąd ładowania statystyk',
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Initial data load
  React.useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadOfficials(), loadCitizens()]);
    };
    loadInitialData();
  }, []);

  // Load stats when data changes
  React.useEffect(() => {
    loadDashboardStats();
  }, [officials.length, citizens.length]);

  // Officials handlers
  const handleCreateOfficial = async (data: OfficialCreateData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/official`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Konto urzędnika zostało utworzone', 'success');
    loadOfficials();
  };

  const handleEditOfficial = (official: OfficialData) => {
    setEditOfficialModal({ open: true, official });
  };

  const handleUpdateOfficial = async (data: OfficialUpdateData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/official`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Dane urzędnika zostały zaktualizowane', 'success');
    loadOfficials();
  };

  const handleDeleteOfficial = (officialID: number) => {
    const official = officials.find((o) => o.officialID === officialID);
    if (official) {
      setDeleteOfficialModal({ open: true, official });
    }
  };

  const handleConfirmDeleteOfficial = async () => {
    if (!deleteOfficialModal.official) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/official?officialID=${deleteOfficialModal.official.officialID}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }

      showNotification('Konto urzędnika zostało usunięte', 'success');
      loadOfficials();
      setDeleteOfficialModal({ open: false, official: null });
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
    }
  };

  // Citizens handlers (reuse from OfficialDashboard)
  const handleViewCitizen = (citizen: CitizenData) => {
    setEditCitizenModal({ open: true, citizen });
  };

  const handleEditCitizen = (citizen: CitizenData) => {
    setEditCitizenModal({ open: true, citizen });
  };

  const handleDeleteCitizen = (citizenID: number) => {
    const citizen = citizens.find((c) => c.citizenID === citizenID);
    if (citizen) {
      setDeleteCitizenModal({ open: true, citizen });
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
      throw new Error(parseBackendError(errorText).message);
    }

    showNotification('Dane obywatela zostały zaktualizowane', 'success');
    loadCitizens();
  };

  const handleConfirmDeleteCitizen = async () => {
    if (!deleteCitizenModal.citizen) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/official/citizen?citizenID=${deleteCitizenModal.citizen.citizenID}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(parseBackendError(errorText).message);
      }

      showNotification('Konto obywatela zostało usunięte', 'success');
      loadCitizens();
      setDeleteCitizenModal({ open: false, citizen: null });
    } catch (error) {
      const parsed = parseBackendError((error as Error)?.message || '');
      showNotification(parsed.message, 'error');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <PageLayout
      title='Panel Administratora'
      subtitle='Zarządzaj systemem mObywatel'
    >
      {notification.open && (
        <Alert
          severity={notification.severity}
          sx={{ mb: 3 }}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Dashboard Stats */}
      <DashboardStatsCard
        stats={
          dashboardStats
            ? {
                totalCitizens: dashboardStats.totalCitizens,
                pendingPersonalDataRequests:
                  dashboardStats.pendingPersonalDataRequests,
                pendingDocumentRequests: dashboardStats.pendingDocumentRequests,
                approvedPersonalDataRequests:
                  dashboardStats.approvedPersonalDataRequests,
                rejectedPersonalDataRequests:
                  dashboardStats.rejectedPersonalDataRequests,
                approvedDocumentRequests:
                  dashboardStats.approvedDocumentRequests,
                rejectedDocumentRequests:
                  dashboardStats.rejectedDocumentRequests,
              }
            : null
        }
        isLoading={isLoadingStats}
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label='admin dashboard tabs'
        >
          <Tab label='Urzędnicy' />
          <Tab label='Obywatele' />
          <Tab label='Logi systemowe' />
        </Tabs>
      </Box>

      {/* Officials Tab */}
      <TabPanel value={activeTab} index={0}>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AppTypography variant='h6'>
            Zarządzanie urzędnikami ({officials.length})
          </AppTypography>
          <Button
            variant='contained'
            startIcon={<Add />}
            onClick={() => setCreateOfficialModal(true)}
          >
            Dodaj urzędnika
          </Button>
        </Box>
        <OfficialsTable
          officials={officials}
          loading={isLoadingOfficials}
          onView={handleEditOfficial}
          onEdit={handleEditOfficial}
          onDelete={handleDeleteOfficial}
        />
      </TabPanel>

      {/* Citizens Tab */}
      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mb: 2 }}>
          <AppTypography variant='h6'>
            Zarządzanie obywatelami ({citizens.length})
          </AppTypography>
          <AppTypography variant='body2' color='text.secondary'>
            Przeglądaj i zarządzaj kontami obywateli w systemie
          </AppTypography>
        </Box>
        <CitizensTable
          citizens={citizens}
          loading={isLoadingCitizens}
          onView={handleViewCitizen}
          onEdit={handleEditCitizen}
          onDelete={handleDeleteCitizen}
        />
      </TabPanel>

      {/* System Logs Tab */}
      <TabPanel value={activeTab} index={2}>
        <Box sx={{ mb: 2 }}>
          <AppTypography variant='h6'>Logi systemowe</AppTypography>
          <AppTypography variant='body2' color='text.secondary'>
            Funkcjonalność logów będzie dostępna w przyszłych wersjach
          </AppTypography>
        </Box>
        <Alert severity='info'>
          Panel logów systemowych jest w trakcie rozwoju. Ta funkcjonalność
          będzie dostępna w przyszłych wersjach systemu.
        </Alert>
      </TabPanel>

      {/* Modals */}
      <CreateOfficialModal
        open={createOfficialModal}
        onClose={() => setCreateOfficialModal(false)}
        onSubmit={handleCreateOfficial}
      />

      <EditOfficialModal
        open={editOfficialModal.open}
        onClose={() => setEditOfficialModal({ open: false, official: null })}
        onSubmit={handleUpdateOfficial}
        officialData={editOfficialModal.official}
      />

      <EditCitizenModal
        open={editCitizenModal.open}
        onClose={() => setEditCitizenModal({ open: false, citizen: null })}
        onSubmit={handleUpdateCitizen}
        citizenData={editCitizenModal.citizen}
      />

      {/* Delete Confirmation Dialogs */}
      <Dialog
        open={deleteOfficialModal.open}
        onClose={() => setDeleteOfficialModal({ open: false, official: null })}
      >
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć konto urzędnika{' '}
            <strong>
              {deleteOfficialModal.official?.firstName}{' '}
              {deleteOfficialModal.official?.lastName}
            </strong>
            ? Ta operacja jest nieodwracalna.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AppButton
            onClick={() =>
              setDeleteOfficialModal({ open: false, official: null })
            }
          >
            Anuluj
          </AppButton>
          <AppButton
            onClick={handleConfirmDeleteOfficial}
            color='error'
            variant='contained'
          >
            Usuń
          </AppButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteCitizenModal.open}
        onClose={() => setDeleteCitizenModal({ open: false, citizen: null })}
      >
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć konto obywatela{' '}
            <strong>
              {deleteCitizenModal.citizen?.firstName}{' '}
              {deleteCitizenModal.citizen?.lastName}
            </strong>
            ? Ta operacja jest nieodwracalna i usunie wszystkie powiązane
            dokumenty i wnioski.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AppButton
            onClick={() =>
              setDeleteCitizenModal({ open: false, citizen: null })
            }
          >
            Anuluj
          </AppButton>
          <AppButton
            onClick={handleConfirmDeleteCitizen}
            color='error'
            variant='contained'
          >
            Usuń
          </AppButton>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}

export default AdminDashboard;
