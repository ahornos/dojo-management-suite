/**
 * @file MainLayout.tsx
 * @description Master layout wrapper for authenticated views.
 */

import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useAcademyTheme } from '@/pages/settings/useAcademyTheme';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { RouteFallback } from './RouteFallback';

/**
 * Orchestrates the primary UI structure consisting of a Sidebar, Header, 
 * a dynamic content area, and a Footer. Uses a Flexbox grid to maintain 
 * full viewport height and responsive behavior.
 * 
 * @component
 * @returns {React.ReactElement} The master layout structure.
 */
export const MainLayout = () => {
  useAcademyTheme();
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        
        <main className="flex-1 overflow-auto p-[var(--space-page)]">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};