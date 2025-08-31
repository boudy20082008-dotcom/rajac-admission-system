import { useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';

// Types for the hook
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// Hook for API calls with loading and error states
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): ApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({
          data: result,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        // Don't update state if request was cancelled
        if (error.name === 'AbortError') {
          return;
        }

        const errorMessage = error.message || 'An unexpected error occurred';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup effect
  useState(() => {
    return cleanup;
  });

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common API operations
export function useLogin() {
  return useApi(apiClient.login.bind(apiClient));
}

export function useRegister() {
  return useApi(apiClient.register.bind(apiClient));
}

export function useProfile() {
  return useApi(apiClient.getProfile.bind(apiClient));
}

export function useSubmitAdmission() {
  return useApi(apiClient.submitAdmission.bind(apiClient));
}

export function useGetApplications() {
  return useApi(apiClient.getMyApplications.bind(apiClient));
}

export function useGetApplication() {
  return useApi(apiClient.getApplication.bind(apiClient));
}

export function useUpdateApplication() {
  return useApi(apiClient.updateApplication.bind(apiClient));
}

export function useDeleteApplication() {
  return useApi(apiClient.deleteApplication.bind(apiClient));
}

export function useAdminDashboard() {
  return useApi(apiClient.getAdminDashboard.bind(apiClient));
}

export function useGetAllApplications() {
  return useApi(apiClient.getAllApplications.bind(apiClient));
}

export function useUpdateApplicationStatus() {
  return useApi(apiClient.updateApplicationStatus.bind(apiClient));
}

export function useUploadFile() {
  return useApi(apiClient.uploadFile.bind(apiClient));
}

export function useUploadMultipleFiles() {
  return useApi(apiClient.uploadMultipleFiles.bind(apiClient));
}

export function useHealthCheck() {
  return useApi(apiClient.healthCheck.bind(apiClient));
}

// Hook for checking authentication status
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => apiClient.isAuthenticated());
  const [user, setUser] = useState<any>(null);

  const checkAuth = useCallback(async () => {
    if (apiClient.isAuthenticated()) {
      try {
        const profile = await apiClient.getProfile();
        setUser(profile.user);
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, clear it
        apiClient.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    checkAuth,
    login,
    logout,
  };
}
