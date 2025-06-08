import React from 'react';
import { Grid, Card, CardContent, Box, Skeleton } from '@mui/material';
import {
  People as PeopleIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';
import { AppTypography } from '../atoms';

export interface AdminDashboardStats {
  totalCitizens: number;
  totalOfficials: number;
}

export interface AdminDashboardStatsCardProps {
  stats: AdminDashboardStats | null;
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

export function AdminDashboardStatsCard({
  stats,
  isLoading,
}: AdminDashboardStatsCardProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <AppTypography variant='h5' gutterBottom sx={{ mb: 3 }}>
        Podgląd systemu
      </AppTypography>

      <Grid container spacing={3}>
        {/* Total Citizens */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <StatCard
            title='Liczba obywateli'
            value={stats?.totalCitizens || 0}
            icon={<PeopleIcon />}
            color='primary'
            isLoading={isLoading}
          />
        </Grid>

        {/* Total Officials */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <StatCard
            title='Liczba urzędników'
            value={stats?.totalOfficials || 0}
            icon={<SupervisorAccountIcon />}
            color='info'
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
