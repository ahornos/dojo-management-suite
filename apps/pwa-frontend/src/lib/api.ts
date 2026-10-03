import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

/**
 * @file api.ts
 * @description Centralized Axios HTTP client configuration for the DMS frontend.
 * Implements request interceptors for JWT and Tenant ID injection, and response
 * interceptors for global error handling (e.g., session expiration).
 */

/**
 * The pre-configured Axios instance to be used for all internal API requests.
 * 
 * @constant apiClient
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Injects the `Authorization` header with the JWT and the `X-School-Id` header 
 * with the current tenant identifier before every request leaves the client.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve state outside of the React component lifecycle
    const { token, tenantId } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-School-Id'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Captures global HTTP errors. Specifically handles 401 Unauthorized errors 
 * by wiping the local session state and redirecting the user to the login view.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);