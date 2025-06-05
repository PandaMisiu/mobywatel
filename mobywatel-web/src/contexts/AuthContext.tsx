import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  AuthContext,
  type AuthContextType,
  type User,
} from './AuthContext.types';
import { API_BASE_URL } from '../config/api';
import { logError } from '../utils/errorUtils';

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate-cookie`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          const userData = {
            userID: data.userID,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roles: Array.isArray(data.roles) ? data.roles : [],
          };

          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('Auth validation successful:', userData);
          }

          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      logError({
        type: 'api_error',
        message: 'Failed to validate authentication',
        context: { error: (error as Error)?.message },
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      // Log response for debugging
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Login response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });
      }

      if (!response.ok) {
        // Clone response to read it multiple times
        const responseClone = response.clone();
        let errorMessage = 'Login failed';

        try {
          // Try to parse as JSON first
          const result = await response.json();
          errorMessage = result.message || errorMessage;

          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('Login JSON error response:', result);
          }
        } catch {
          // If JSON parsing fails, try plain text
          try {
            const textResponse = await responseClone.text();
            if (textResponse) {
              // Backend might return "Bad request: actual_error_message"
              if (textResponse.startsWith('Bad request: ')) {
                errorMessage = textResponse.replace('Bad request: ', '');
              } else {
                errorMessage = textResponse;
              }
            }

            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.log('Login text error response:', textResponse);
            }
          } catch (textError) {
            logError({
              type: 'api_error',
              message: 'Failed to parse login error response',
              context: { textError },
            });
          }
        }

        logError({
          type: 'api_error',
          message: errorMessage,
          context: {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          },
        });

        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Login success response:', result);
      }

      if (!result.success) {
        const errorMessage = result.message || 'Login failed';
        logError({
          type: 'api_error',
          message: errorMessage,
          context: { result },
        });
        throw new Error(errorMessage);
      }

      // Refresh user data after successful login
      await checkAuth();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling component
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error during login');
    }
  };

  const logout = async () => {
    try {
      // Clear the JWT cookie by calling logout endpoint if it exists
      // For now, we'll just clear the user state and let the cookie expire
      setUser(null);

      // Optionally, you could call a logout endpoint that clears the cookie:
      // await fetch(`${API_BASE_URL}/api/auth/logout`, {
      //   method: 'POST',
      //   credentials: 'include',
      // });
    } catch (error) {
      logError({
        type: 'api_error',
        message: 'Failed to logout',
        context: { error: (error as Error)?.message },
      });
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
