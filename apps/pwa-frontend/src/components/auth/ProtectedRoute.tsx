/**
 * @file ProtectedRoute.tsx
 * @description Route guard component to prevent unauthorized access to private areas.
 */

import { Navigate, Outlet } from 'react-router-dom';

/**
 * Intercepts navigation to private routes.
 * Checks for a valid authentication token in the local storage.
 * If the user is authenticated, it renders the nested child routes via `<Outlet />`.
 * If not, it redirects the user to the login view.
 * 
 * @component
 * @returns {React.ReactElement} The protected child components or a redirection to the login page.
 */
export const ProtectedRoute = () => {
  // Basic authentication check (to be replaced with a proper state manager like Zustand or Redux)
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if the user is authenticated
  return <Outlet />;
};