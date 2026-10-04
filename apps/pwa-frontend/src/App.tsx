/**
 * @file App.tsx
 * @description Main application component and routing configuration root.
 * Orchestrates public and protected routes, layout wrappers, and dynamic views.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

// Module Views
import Login from '@/pages/Login';
import Users from '@/pages/Users';
import Students from './pages/Students'; 

/**
 * Placeholder component for the Dashboard view.
 * Uses translation hooks to avoid hardcoded text.
 */
const Dashboard = () => {
  const { t } = useTranslation();
  return <div className="bg-white p-6 rounded-lg shadow">{t('dashboard.welcome')}</div>;
};

/**
 * Placeholder component for the Attendances view.
 */
const Attendances = () => {
  const { t } = useTranslation();
  return <div className="bg-white p-6 rounded-lg shadow">{t('modules.attendances')}</div>;
};

/**
 * Placeholder component for the Graduations view.
 */
const Graduations = () => {
  const { t } = useTranslation();
  return <div className="bg-white p-6 rounded-lg shadow">{t('modules.graduations')}</div>;
};

/**
 * Placeholder component for the Financial view.
 */
const Financial = () => {
  const { t } = useTranslation();
  return <div className="bg-white p-6 rounded-lg shadow">{t('modules.financial')}</div>;
};

/**
 * Initializes the React Router configuration.
 * Defines public routes and wraps private routes inside protected and layout boundaries.
 * 
 * @component
 * @returns {React.ReactElement} The configured application router.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Default redirection to the dashboard upon successful login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Connected Submodules */}
            <Route path="/users" element={<Users />} />
            <Route path="/students" element={<Students />} />
            
            <Route path="/attendances" element={<Attendances />} />
            <Route path="/graduations" element={<Graduations />} />
            <Route path="/financial" element={<Financial />} />
          </Route>
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;