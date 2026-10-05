/**
 * @file Sidebar.tsx
 * @description Navigation sidebar component for the main layout.
 * Includes internationalization support and Role-Based Access Control (RBAC) 
 * to dynamically filter menu visibility based on user credentials.
 */

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Interface representing a navigation menu item.
 */
interface MenuItem {
  name: string;
  path: string;
  icon: string;
  allowedRoles?: string[];
}

/**
 * Renders the main vertical navigation menu for the Dojo Management Suite.
 * Filters menu links dynamically based on the authenticated user's role.
 * 
 * @component
 * @returns {React.ReactElement} The filtered sidebar navigation structure.
 */
export const Sidebar = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || 'STUDENT';

  /**
   * Complete list of navigation items utilizing the translation function 't'.
   * Restricted modules explicitly define their 'allowedRoles'.
   */
  const menuItems: MenuItem[] = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: '📊' },
    { 
      name: t('sidebar.users'), 
      path: '/users', 
      icon: '👥',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'] // Restricted to administrative roles matching App.tsx routing rules
    },
    { name: t('sidebar.students'), path: '/students', icon: '🥋' },
    { name: t('sidebar.attendances'), path: '/attendances', icon: '📅' },
    { name: t('sidebar.graduations'), path: '/graduations', icon: '📜' },
    { name: t('sidebar.financial'), path: '/financial', icon: '💳' }
  ];

  /**
   * Filters menu items dynamically based on the user's current system role.
   */
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  });

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        {t('sidebar.title')}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
              }`
            }
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};