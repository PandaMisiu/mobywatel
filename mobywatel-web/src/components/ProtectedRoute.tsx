import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { AppTypography } from '../components/atoms';

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: string;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('ProtectedRoute check:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRoles: user?.roles,
      requiredRole,
      location: location.pathname,
    });
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <AppTypography variant='h6' color='text.secondary'>
          Sprawdzanie uprawnień...
        </AppTypography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (
    requiredRole &&
    user &&
    (!user.roles || !user.roles.includes(requiredRole))
  ) {
    // User doesn't have required role or roles are not loaded yet
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(
        'Access denied: User roles',
        user.roles,
        'Required role:',
        requiredRole
      );
    }
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          textAlign: 'center',
        }}
      >
        <AppTypography variant='h6' color='error'>
          Brak uprawnień do tej strony
        </AppTypography>
      </Box>
    );
  }

  return children;
}

// Convenience component for citizen-only routes
export function CitizenRoute({ children }: { children: ReactElement }) {
  return (
    <ProtectedRoute requiredRole='ROLE_CITIZEN'>{children}</ProtectedRoute>
  );
}

// Convenience component for official-only routes
export function OfficialRoute({ children }: { children: ReactElement }) {
  return (
    <ProtectedRoute requiredRole='ROLE_OFFICIAL'>{children}</ProtectedRoute>
  );
}

// Convenience component for admin-only routes
export function AdminRoute({ children }: { children: ReactElement }) {
  return <ProtectedRoute requiredRole='ROLE_ADMIN'>{children}</ProtectedRoute>;
}
