/**
 * @file App.tsx
 * @description Main application component and routing configuration root.
 * Orchestrates public and protected routes, layout wrappers, and lazy-loaded views.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { RouteFallback } from './components/layout/RouteFallback';

const Login = lazy(() => import('@/pages/login/Login'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Users = lazy(() => import('@/pages/users/Users'));
const UserCreatePage = lazy(() => import('@/pages/users/UserCreatePage'));
const UserEditPage = lazy(() => import('@/pages/users/UserEditPage'));
const Students = lazy(() => import('@/pages/students/Students'));
const StudentCreatePage = lazy(() => import('@/pages/students/StudentCreatePage'));
const StudentEditPage = lazy(() => import('@/pages/students/StudentEditPage'));
const Federations = lazy(() => import('@/pages/financial/federations/Federations'));
const FederationCreatePage = lazy(() => import('@/pages/financial/federations/FederationCreatePage'));
const FederationEditPage = lazy(() => import('@/pages/financial/federations/FederationEditPage'));
const Licenses = lazy(() => import('@/pages/financial/licenses/Licenses'));
const BatchWizard = lazy(() => import('@/pages/financial/licenses/BatchWizard'));
const Attendances = lazy(() => import('@/pages/attendances/Attendances'));
const AttendanceSession = lazy(() => import('@/pages/attendances/AttendanceSession'));
const AcademySettings = lazy(() => import('@/pages/settings/AcademySettings'));

/**
 * Placeholder component for the Graduations view.
 */
const Graduations = () => {
  const { t } = useTranslation();
  return <div className="bg-card p-6 rounded-lg shadow">{t('modules.graduations')}</div>;
};

/**
 * Preserves the federation id when rewriting the legacy edit URL.
 *
 * @returns {JSX.Element} Redirect to `/federations/:id/edit`.
 */
function LegacyFederationEditRedirect(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/federations/${id}/edit`} replace />;
}

/**
 * Preserves the session id when rewriting `/attendance/session/:id`.
 *
 * @returns {JSX.Element} Redirect to `/attendances/:id`.
 */
function LegacyAttendanceSessionRedirect(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/attendances/${id}`} replace />;
}

/**
 * Initializes the React Router configuration with lazy-loaded entity CRUD routes.
 *
 * @component
 * @returns {React.ReactElement} The configured application router.
 */
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_STAFF']} />}>
                <Route path="/users" element={<Users />} />
                <Route path="/users/new" element={<UserCreatePage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_STAFF', 'SPORTS_TECHNICAL_DIRECTOR']} />}>
                <Route path="/disciplines" element={<Navigate to="/settings?tab=academic" replace />} />
                <Route path="/disciplines/new" element={<Navigate to="/settings?tab=academic" replace />} />
                <Route path="/disciplines/:id/edit" element={<Navigate to="/settings?tab=academic" replace />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_STAFF', 'INSTRUCTOR']} />}>
                <Route path="/students" element={<Students />} />
                <Route path="/students/new" element={<StudentCreatePage />} />
                <Route path="/students/:id/edit" element={<StudentEditPage />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={['SUPER_ADMIN', 'ADMIN_STAFF', 'SPORTS_TECHNICAL_DIRECTOR', 'INSTRUCTOR']}
                  />
                }
              >
                <Route path="/attendances" element={<Attendances />} />
                <Route path="/attendances/:sessionId" element={<AttendanceSession />} />
                <Route path="/attendance" element={<Navigate to="/attendances" replace />} />
                <Route path="/attendance/session/:id" element={<LegacyAttendanceSessionRedirect />} />
              </Route>
              <Route path="/graduations" element={<Graduations />} />

              <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_STAFF']} />}>
                <Route path="/settings" element={<AcademySettings />} />
                <Route path="/academy/config" element={<Navigate to="/settings" replace />} />
                <Route path="/financial" element={<Navigate to="/settings?tab=billing" replace />} />
                <Route path="/financial/config" element={<Navigate to="/settings?tab=billing" replace />} />

                <Route path="/federations" element={<Federations />} />
                <Route path="/federations/new" element={<FederationCreatePage />} />
                <Route path="/federations/:id/edit" element={<FederationEditPage />} />
                <Route path="/licenses" element={<Licenses />} />
                <Route path="/licenses/batch" element={<BatchWizard />} />

                <Route path="/financial/federations" element={<Navigate to="/federations" replace />} />
                <Route path="/financial/federations/new" element={<Navigate to="/federations/new" replace />} />
                <Route path="/financial/federations/:id/edit" element={<LegacyFederationEditRedirect />} />
                <Route path="/financial/licenses" element={<Navigate to="/licenses" replace />} />
                <Route path="/financial/licenses/batch" element={<Navigate to="/licenses/batch" replace />} />
                <Route path="/financial/licenses/budget" element={<Navigate to="/licenses" replace />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
