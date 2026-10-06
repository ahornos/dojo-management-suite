import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @file useAuthStore.ts
 * @description Global state management for authentication and multi-tenant resolution 
 * using Zustand[cite: 35]. Includes persistence to local storage to maintain sessions.
 */

/**
 * Extracts the tenant (school) identifier dynamically from the current URL hostname
 * or falls back to the default environment configuration[cite: 35].
 * 
 * @function resolveTenantId
 * @returns {string} The resolved tenant ID.
 */
const resolveTenantId = (): string => {
  const host = window.location.hostname;
  
  if (host === 'localhost' || host === '127.0.0.1') {
    return import.meta.env.VITE_DEFAULT_TENANT_ID || 'fox-jiujitsu-academy'; 
  }
  
  const parts = host.split('.');
  return parts.length >= 3 ? parts[0] : (import.meta.env.VITE_DEFAULT_TENANT_ID || 'fox-jiujitsu-academy');
};

/**
 * @interface UserPayload
 * @description Represents the authenticated user's profile metadata, supporting multiple roles[cite: 35].
 */
export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[]; // Updated from singular 'role' to support multi-role arrays
}

/**
 * @interface AuthState
 * @description Defines the structure of the authentication global state store[cite: 35].
 */
export interface AuthState {
  token: string | null;
  user: UserPayload | null;
  tenantId: string;
  setAuth: (token: string, user: UserPayload) => void;
  logout: () => void;
}

/**
 * Zustand hook for accessing and mutating the authentication state[cite: 35].
 * State is automatically persisted to `localStorage` under the key 'dms-auth-storage'[cite: 35].
 * 
 * @constant useAuthStore
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      tenantId: resolveTenantId(),
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'dms-auth-storage',
    }
  )
);