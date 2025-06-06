import React, { useState, useCallback } from 'react';
import type { FormError } from '../utils/errorUtils';
import {
  validateFormField,
  logError,
  handleApiError,
} from '../utils/errorUtils';

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  requiredFields?: (keyof T)[];
  onSubmit: (data: T) => Promise<void>;
  validateOnChange?: boolean;
}

export interface UseFormResult<T extends Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  generalError: string;
  handleChange: (name: keyof T, value: unknown) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  setError: (field: keyof T | 'general', message: string) => void;
  clearErrors: () => void;
  setFieldError: (field: keyof T, message: string) => void;
  resetForm: () => void;
  hasErrors: boolean;
  isValid: boolean;
}

/**
 * Enhanced form hook with error handling and validation
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  requiredFields = [],
  onSubmit,
  validateOnChange = true,
}: UseFormOptions<T>): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );
  const [generalError, setGeneralError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update values when initialValues change (for cases like editing different entities)
  // Use deep comparison to prevent unnecessary re-renders when object content is the same
  const stableInitialValues = React.useMemo(() => {
    return initialValues;
  }, [JSON.stringify(initialValues)]);

  React.useEffect(() => {
    setValues(stableInitialValues);
  }, [stableInitialValues]);

  const handleChange = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear existing error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      // Validate on change if enabled
      if (validateOnChange) {
        const fieldError = validateFormField(String(name), value);
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldError.message,
          }));
        }
      }
    },
    [errors, validateOnChange]
  );

  const setError = useCallback(
    (field: keyof T | 'general', message: string) => {
      if (field === 'general') {
        setGeneralError(message);
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }));
      }
    },
    []
  );

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({} as Record<keyof T, string>);
    setGeneralError('');
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>;
    let isValid = true;

    // Validate required fields
    for (const field of requiredFields) {
      const value = values[field];

      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = 'To pole jest wymagane';
        isValid = false;
        continue;
      }

      // Validate field format
      const fieldError = validateFormField(String(field), value);
      if (fieldError) {
        newErrors[field] = fieldError.message;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, requiredFields]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (isSubmitting) return;

      // Clear previous errors
      clearErrors();

      // Validate form
      if (!validateForm()) {
        logError({
          type: 'form_error',
          message: 'Form validation failed',
          context: {
            formData: values,
            errors: errors,
          },
        });
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        // Error should be handled by the onSubmit function
        // This is just a fallback
        logError({
          type: 'form_error',
          message: 'Unexpected error in form submission',
          context: { error: (error as Error)?.message },
        });
        setGeneralError('Wystąpił nieoczekiwany błąd');
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, errors, isSubmitting, validateForm, clearErrors, onSubmit]
  );

  const hasErrors = Object.keys(errors).length > 0 || generalError !== '';
  const isValid =
    !hasErrors &&
    requiredFields.every((field) => {
      const value = values[field];
      return value && (typeof value !== 'string' || value.trim() !== '');
    });

  const resetForm = useCallback(() => {
    setValues(stableInitialValues);
    setErrors({} as Record<keyof T, string>);
    setGeneralError('');
  }, [stableInitialValues]);

  return {
    values,
    errors,
    isSubmitting,
    generalError,
    handleChange,
    handleSubmit,
    setError,
    clearErrors,
    setFieldError,
    resetForm,
    hasErrors,
    isValid,
  };
}

/**
 * Hook for API form submissions with enhanced error handling
 */
export function useApiForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T> & {
    apiEndpoint: string;
    method?: 'POST' | 'PUT' | 'PATCH';
    onSuccess?: (response: unknown) => void;
    onError?: (error: FormError) => void;
  }
) {
  const {
    apiEndpoint,
    method = 'POST',
    onSuccess,
    onError,
    ...formOptions
  } = options;

  const apiSubmit = useCallback(
    async (data: T) => {
      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await handleApiError(response);

        if (onError) {
          onError(error);
        }

        throw error;
      }

      const result = await response.json();

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    },
    [apiEndpoint, method, onSuccess, onError]
  );

  return useForm({
    ...formOptions,
    onSubmit: apiSubmit,
  });
}
