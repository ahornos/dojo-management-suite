/**
 * @file api.ts
 * @description Configures the global Axios instance for the frontend.
 * Implements request interceptors for JWT injection and response interceptors 
 * for centralized error and session management.
 */

import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (!apiBaseUrl) {
  throw new Error('FATAL: VITE_API_BASE_URL is required and must not be empty.');
}

/**
 * Pre-configured Axios instance pointing to the API Gateway.
 *
 * @constant
 */
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout limit
});

/**
 * Request Interceptor: Injects the JWT authorization token into outgoing requests 
 * if available in the global auth store or local storage.
 */
apiClient.interceptors.request.use(
  (config) => {
    // 1. Try to get token directly from Zustand state
    let token = useAuthStore.getState().token;

    // 2. Fallback: Parse Zustand's persisted storage in localStorage if not in memory
    if (!token) {
      try {
        const persistedStore = localStorage.getItem('dms-auth-storage');
        if (persistedStore) {
          const parsed = JSON.parse(persistedStore);
          token = parsed?.state?.token;
        }
      } catch (e) {
        console.error('Failed to parse auth storage', e);
      }
    }

    // 3. Ultimate fallback to raw token item
    if (!token) {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenantId = useAuthStore.getState().tenantId;
    if (tenantId) {
      config.headers['x-school-id'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handles global error responses.
 * Detects both proper HTTP errors and proxy-swallowed errors (200 OK with error payload).
 */
apiClient.interceptors.response.use(
  (response) => {
    // Defensive check: If the API Gateway swallows a 401/403 and returns it as a 200 OK body
    if (response.data && (response.data.statusCode === 401 || response.data.statusCode === 403)) {
      useAuthStore.getState().logout(); // Fixed: use logout instead of clearAuth
      localStorage.removeItem('token');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error(response.data.message || 'UNAUTHORIZED'));
    }
    
    return response;
  },
  (error) => {
    // Standard HTTP error handling
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      useAuthStore.getState().logout(); // Fixed: use logout instead of clearAuth
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);