// Types for Official Dashboard

export interface CitizenData {
  citizenID: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  PESEL: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
}

export interface PersonalDataUpdateRequest {
  requestID: number;
  citizenID: number;
  requestedFirstName: string;
  requestedLastName: string;
  requestedGender: 'MALE' | 'FEMALE';
  approved: boolean;
  processed: boolean;
  requestDate: string;
}

export interface DocumentIssueRequest {
  requestID: number;
  citizenID: number;
  photoURL: string;
  type: 'IDENTITY_CARD' | 'DRIVER_LICENSE';
  // Identity Card specific
  citizenship?: string;
  // Driver License specific
  categories?: string[];
}

export interface ProcessPersonalDataRequest {
  requestID: number;
  approval: boolean;
}

export interface ProcessDocumentRequest {
  requestID: number;
  approval: boolean;
  expirationDate: string; // LocalDate in format YYYY-MM-DD
}

export interface CitizenSearchCriteria {
  citizenID?: number;
  PESEL?: string;
}

export interface CitizenUpdateData extends Record<string, unknown> {
  citizenID: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  PESEL: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
}
