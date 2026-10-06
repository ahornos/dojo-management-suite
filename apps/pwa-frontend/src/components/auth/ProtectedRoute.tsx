/**
 * @file ProtectedRoute.tsx
 * @description Advanced route guard component supporting authentication and Role-Based Access Control (RBAC)[cite: 36].
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

/**
 * Intercepts navigation to private routes[cite: 36].
 * Validates session existence and verifies if any of the user's roles match permitted roles[cite: 36].
 * 
 * @component
 * @param {ProtectedRouteProps} props - Configuration rules for the route guard[cite: 36].
 * @returns {React.ReactElement} The protected child components or a redirection[cite: 36].
 */
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token) || localStorage.getItem('token');
  const user = useAuthStore((state) => state.user);

  // 1. Check basic authentication[cite: 36]
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check RBAC permissions against the user's roles array if restricted
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user?.roles || ['STUDENT'];
    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));
    
    if (!hasPermission) {
      // Redirect unauthorized users to a safe default view (e.g., dashboard)[cite: 36]
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Render child routes if validation succeeds[cite: 36]
  return <Outlet />;
};