/**
 * @file ProtectedRoute.tsx
 * @description Advanced route guard component supporting authentication and Role-Based Access Control (RBAC).
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

/**
 * Intercepts navigation to private routes.
 * Validates session existence and verifies if any of the user's roles match permitted roles.
 * 
 * @component
 * @param {ProtectedRouteProps} props - Configuration rules for the route guard.
 * @returns {React.ReactElement} The protected child components or a redirection.
 */
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token) || localStorage.getItem('token');
  const user = useAuthStore((state) => state.user);

  // 1. Check basic authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check RBAC permissions against the user's roles array if restricted
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user?.roles || ['STUDENT'];
    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));
    
    if (!hasPermission) {
      // Redirect unauthorized users to a safe default view (e.g., dashboard)
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Render child routes if validation succeeds
  return <Outlet />;
};