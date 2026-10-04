/**
 * @file MainLayout.tsx
 * @description Master layout wrapper for authenticated views.
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Orchestrates the primary UI structure consisting of a Sidebar, Header, 
 * a dynamic content area, and a Footer. Uses a Flexbox grid to maintain 
 * full viewport height and responsive behavior.
 * 
 * @component
 * @returns {React.ReactElement} The master layout structure.
 */
export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};