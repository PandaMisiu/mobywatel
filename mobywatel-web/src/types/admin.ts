// Types for Admin Dashboard

export interface OfficialData {
  officialID: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
}

export interface OfficialCreateData extends Record<string, unknown> {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
}

export interface OfficialUpdateData extends Record<string, unknown> {
  officialID: number;
  email: string;
  password?: string; // Optional for updates
  firstName: string;
  lastName: string;
  position: string;
}

export interface AdminDashboardStats {
  totalOfficials: number;
  totalCitizens: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  user?: string;
  action?: string;
  details?: string;
}

// Re-export types that admin can also manage
export type { CitizenData, CitizenUpdateData } from './official';
