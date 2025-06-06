import React from 'react';
import { Grid, Card, CardContent, Box, Skeleton } from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { AppTypography } from '../atoms';

export interface DashboardStats {
  totalCitizens: number;
  pendingPersonalDataRequests: number;
  pendingDocumentRequests: number;
  approvedPersonalDataRequests: number;
  rejectedPersonalDataRequests: number;
  approvedDocumentRequests: number;
  rejectedDocumentRequests: number;
}

export interface DashboardStatsCardProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  isLoading?: boolean;
}

function StatCard({ title, value, icon, color, isLoading }: StatCardProps) {
  const getColorStyles = (color: string) => {
    const colors = {
      primary: { bg: 'primary.light', text: 'primary.main' },
      success: { bg: 'success.light', text: 'success.main' },
      warning: { bg: 'warning.light', text: 'warning.main' },
      error: { bg: 'error.light', text: 'error.main' },
      info: { bg: 'info.light', text: 'info.main' },
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const colorStyles = getColorStyles(color);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <AppTypography variant='h6' color='text.secondary' gutterBottom>
              {title}
            </AppTypography>
            {isLoading ? (
              <Skeleton variant='text' width={60} height={40} />
            ) : (
              <AppTypography
                variant='h4'
                color={colorStyles.text}
                fontWeight='bold'
              >
                {value.toLocaleString('pl-PL')}
              </AppTypography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: colorStyles.bg,
              color: colorStyles.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DashboardStatsCard({
  stats,
  isLoading,
}: DashboardStatsCardProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <AppTypography variant='h5' gutterBottom sx={{ mb: 3 }}>
        Przegląd systemu
      </AppTypography>

      <Grid container spacing={3}>
        {/* Total Citizens */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title='Wszyscy obywatele'
            value={stats?.totalCitizens || 0}
            icon={<PeopleIcon />}
            color='primary'
            isLoading={isLoading}
          />
        </Grid>

        {/* Pending Personal Data Requests */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title='Oczekujące wnioski - dane osobowe'
            value={stats?.pendingPersonalDataRequests || 0}
            icon={<HourglassEmptyIcon />}
            color='warning'
            isLoading={isLoading}
          />
        </Grid>

        {/* Pending Document Requests */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title='Oczekujące wnioski - dokumenty'
            value={stats?.pendingDocumentRequests || 0}
            icon={<AssignmentIcon />}
            color='warning'
            isLoading={isLoading}
          />
        </Grid>

        {/* Approved Personal Data Requests */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title='Zatwierdzone - dane osobowe'
            value={stats?.approvedPersonalDataRequests || 0}
            icon={<CheckCircleIcon />}
            color='success'
            isLoading={isLoading}
          />
        </Grid>

        {/* Rejected Personal Data Requests */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title='Odrzucone - dane osobowe'
            value={stats?.rejectedPersonalDataRequests || 0}
            icon={<CancelIcon />}
            color='error'
            isLoading={isLoading}
          />
        </Grid>

        {/* Document Requests Summary */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title='Przetworzone dokumenty'
            value={
              (stats?.approvedDocumentRequests || 0) +
              (stats?.rejectedDocumentRequests || 0)
            }
            icon={<DescriptionIcon />}
            color='info'
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
