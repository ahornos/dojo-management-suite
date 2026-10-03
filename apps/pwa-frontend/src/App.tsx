import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from '@/pages/Login';

/**
 * @file App.tsx
 * @description Main application entry point that configures the global routing 
 * and injects the TanStack Query client provider for asynchronous state management.
 */

/**
 * Pre-configured TanStack Query client instance.
 * Optimizes network requests by disabling automatic refetches on window focus 
 * and limiting retries on failure.
 * 
 * @constant queryClient
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, 
    },
  },
});

/**
 * Placeholder component for the Dashboard view.
 * This will be replaced with a protected layout in subsequent iterations.
 * 
 * @function DashboardView
 * @returns {JSX.Element} The temporary dashboard interface.
 */
const DashboardView = () => (
  <div className="p-8 bg-background min-h-screen">
    <h1 className="text-2xl font-bold text-primary">Panel de Control</h1>
    <p className="text-foreground">Bienvenido al área privada</p>
  </div>
);

/**
 * Root application component defining the global route structure.
 * Wraps the router with the necessary context providers.
 * 
 * @function App
 * @returns {JSX.Element} The root application tree.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Private Routes (Route Guards to be implemented) */}
          <Route path="/dashboard" element={<DashboardView />} />
          
          {/* Default fallback redirection */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;