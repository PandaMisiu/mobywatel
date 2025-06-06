/**
 * Utility functions for handling and logging errors
 */

export interface FormError {
  field?: string;
  message: string;
  type: 'validation' | 'network' | 'server';
}

export interface ErrorLogEntry {
  timestamp?: Date;
  type: 'form_error' | 'api_error' | 'network_error';
  message: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

/**
 * Parse backend error messages and extract meaningful information
 */
export function parseBackendError(errorMessage: string): FormError {
  // Map of backend error patterns to user-friendly messages
  const errorMappings = [
    {
      pattern: /(bad request.*incorrect email|incorrect email)/i,
      field: 'email',
      message: 'Niepoprawny format adresu email',
    },
    {
      pattern: /(bad request.*incorrect password|incorrect password)/i,
      field: 'password',
      message: 'Hasło nie spełnia wymagań bezpieczeństwa',
    },
    {
      pattern: /(bad request.*email is taken|email is taken)/i,
      field: 'email',
      message: 'Ten adres email jest już zajęty',
    },
    {
      pattern: /(bad request.*pesel is taken|pesel is taken)/i,
      field: 'PESEL',
      message: 'Ten numer PESEL jest już zarejestrowany',
    },
    {
      pattern: /(bad request.*invalid pesel|invalid pesel)/i,
      field: 'PESEL',
      message: 'Niepoprawny numer PESEL',
    },
    {
      pattern:
        /(bad request.*the birth date and gender must match.*pesel|the birth date and gender must match.*pesel)/i,
      field: 'PESEL',
      message: 'Data urodzenia i płeć muszą odpowiadać numerowi PESEL',
    },
    {
      pattern: /(bad request.*citizen id is required|citizen id is required)/i,
      field: 'citizenID',
      message: 'ID obywatela jest wymagane',
    },
    {
      pattern: /(bad request.*field is null|field is null)/i,
      message: 'Wszystkie pola są wymagane',
    },
    {
      pattern: /(bad request.*field is blank|field is blank)/i,
      message: 'Wszystkie pola muszą być wypełnione',
    },
    {
      pattern:
        /(bad request.*birth date is after current date|birth date is after current date)/i,
      field: 'birthDate',
      message: 'Data urodzenia nie może być z przyszłości',
    },
    {
      pattern: /bad credentials/i,
      message: 'Niepoprawny email lub hasło',
    },
    {
      pattern: /email not found/i,
      field: 'email',
      message: 'Nie znaleziono konta z tym adresem email',
    },
    {
      pattern: /user not found/i,
      message: 'Nie znaleziono użytkownika',
    },
    {
      pattern: /jwt.*expired/i,
      message: 'Sesja wygasła. Zaloguj się ponownie.',
    },
    {
      pattern: /unauthorized/i,
      message: 'Brak uprawnień do wykonania tej operacji',
    },
    {
      pattern: /conflict/i,
      message: 'Wystąpił konflikt danych. Spróbuj ponownie.',
    },
  ];

  // Find matching error pattern
  for (const mapping of errorMappings) {
    if (mapping.pattern.test(errorMessage)) {
      return {
        field: mapping.field,
        message: mapping.message,
        type: 'server',
      };
    }
  }

  // Fallback for unknown errors
  return {
    message: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
    type: 'server',
  };
}

/**
 * Validate form fields on the client side
 */
export function validateFormField(
  fieldName: string,
  value: unknown
): FormError | null {
  switch (fieldName) {
    case 'email':
      if (!value || typeof value !== 'string') {
        return {
          field: 'email',
          message: 'Email jest wymagany',
          type: 'validation',
        };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return {
          field: 'email',
          message: 'Niepoprawny format email',
          type: 'validation',
        };
      }
      break;

    case 'password':
      if (!value || typeof value !== 'string') {
        return {
          field: 'password',
          message: 'Hasło jest wymagane',
          type: 'validation',
        };
      }
      if (value.length < 8) {
        return {
          field: 'password',
          message: 'Hasło musi mieć co najmniej 8 znaków',
          type: 'validation',
        };
      }
      if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$/.test(
          value
        )
      ) {
        return {
          field: 'password',
          message:
            'Hasło musi mieć 8-40 znaków i zawierać: wielką literę, małą literę, cyfrę i znak specjalny (@$!%*?&)',
          type: 'validation',
        };
      }
      break;

    case 'PESEL':
      if (!value || typeof value !== 'string') {
        return {
          field: 'PESEL',
          message: 'PESEL jest wymagany',
          type: 'validation',
        };
      }
      if (!/^\d{11}$/.test(value)) {
        return {
          field: 'PESEL',
          message: 'PESEL musi składać się z 11 cyfr',
          type: 'validation',
        };
      }
      break;

    case 'firstName':
    case 'lastName':
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        const fieldLabel = fieldName === 'firstName' ? 'Imię' : 'Nazwisko';
        return {
          field: fieldName,
          message: `${fieldLabel} jest wymagane`,
          type: 'validation',
        };
      }
      if (value.trim().length < 2) {
        const fieldLabel = fieldName === 'firstName' ? 'Imię' : 'Nazwisko';
        return {
          field: fieldName,
          message: `${fieldLabel} musi mieć co najmniej 2 znaki`,
          type: 'validation',
        };
      }
      break;

    case 'birthDate': {
      if (!value) {
        return {
          field: 'birthDate',
          message: 'Data urodzenia jest wymagana',
          type: 'validation',
        };
      }
      const birthDate = new Date(value as string | number | Date);
      const today = new Date();
      if (birthDate > today) {
        return {
          field: 'birthDate',
          message: 'Data urodzenia nie może być z przyszłości',
          type: 'validation',
        };
      }
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 120);
      if (birthDate < minDate) {
        return {
          field: 'birthDate',
          message: 'Niepoprawna data urodzenia',
          type: 'validation',
        };
      }
      break;
    }

    case 'gender':
      if (!value || !['MALE', 'FEMALE'].includes(value as string)) {
        return {
          field: 'gender',
          message: 'Płeć jest wymagana',
          type: 'validation',
        };
      }
      break;
  }

  return null;
}

/**
 * Log errors for debugging and monitoring
 */
export function logError(error: ErrorLogEntry): void {
  // Add timestamp and browser information
  const enrichedError = {
    ...error,
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  // Store in localStorage for debugging (keep last 50 entries)
  try {
    const storedErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    storedErrors.unshift(enrichedError);

    // Keep only last 50 errors
    const trimmedErrors = storedErrors.slice(0, 50);
    localStorage.setItem('errorLogs', JSON.stringify(trimmedErrors));
  } catch (e) {
    // In development, log to console for debugging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Failed to store error log in localStorage:', e);
    }
  }

  // In production, you could send errors to a logging service like Sentry
  // Example: Sentry.captureException(new Error(error.message), { extra: enrichedError });
}

/**
 * Handle API response errors
 */
export async function handleApiError(response: Response): Promise<FormError> {
  let errorMessage = 'Wystąpił błąd serwera';

  try {
    // Try to parse error message from response
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } else {
      errorMessage = (await response.text()) || errorMessage;
    }
  } catch (e) {
    // In development, log to console for debugging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse error response:', e);
    }
  }

  // Log the API error
  logError({
    type: 'api_error',
    message: errorMessage,
    context: {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    },
  });

  return parseBackendError(errorMessage);
}

/**
 * Handle network errors
 */
export function handleNetworkError(error: Error): FormError {
  logError({
    type: 'network_error',
    message: error.message,
    context: {
      name: error.name,
      stack: error.stack,
    },
  });

  return {
    message: 'Błąd połączenia z serwerem. Sprawdź połączenie internetowe.',
    type: 'network',
  };
}

/**
 * Get stored error logs for debugging
 */
export function getErrorLogs(): ErrorLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  } catch (e) {
    // In development, log to console for debugging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Failed to retrieve error logs:', e);
    }
    return [];
  }
}

/**
 * Clear stored error logs
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem('errorLogs');
  } catch (e) {
    // In development, log to console for debugging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear error logs:', e);
    }
  }
}

/**
 * Validate entire form and return all errors
 */
export function validateForm(
  formData: Record<string, unknown>,
  requiredFields: string[]
): FormError[] {
  const errors: FormError[] = [];

  for (const field of requiredFields) {
    const error = validateFormField(field, formData[field]);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}
