/**
 * @file Sidebar.tsx
 * @description Navigation sidebar component for the main layout.
 * Includes internationalization support and Role-Based Access Control (RBAC) 
 * to dynamically filter menu visibility based on user credentials[cite: 34].
 */

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  allowedRoles?: string[];
}

/**
 * Renders the main vertical navigation menu for the Dojo Management Suite[cite: 34].
 * Filters menu links dynamically based on the authenticated user's roles array[cite: 34].
 * 
 * @component
 * @returns {React.ReactElement} The filtered sidebar navigation structure[cite: 34].
 */
export const Sidebar = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  
  // Retrieve roles array from authenticated user state, defaulting to STUDENT
  const userRoles = user?.roles || ['STUDENT'];

  const menuItems: MenuItem[] = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: '📊' },
    { 
      name: t('sidebar.users'), 
      path: '/users', 
      icon: '👥',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'] 
    },
    { 
      name: t('sidebar.disciplines'), 
      path: '/disciplines', 
      icon: '🥋',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF', 'SPORTS_TECHNICAL_DIRECTOR'] 
    },
    { name: t('sidebar.students'), path: '/students', icon: '🧑‍🎓' },
    { name: t('sidebar.attendances'), path: '/attendances', icon: '📅' },
    { name: t('sidebar.graduations'), path: '/graduations', icon: '📜' },
    { name: t('sidebar.financial'), path: '/financial', icon: '💳' }
  ];

  /**
   * Filters menu items dynamically if any of the user's roles match the allowed roles[cite: 34].
   */
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return userRoles.some((role) => item.allowedRoles?.includes(role));
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

export default Sidebar;