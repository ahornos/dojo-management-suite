/**
 * @file Sidebar.tsx
 * @description Navigation sidebar component for the main layout.
 * Includes internationalization support and Role-Based Access Control (RBAC) 
 * to dynamically filter menu visibility based on user credentials.
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
 * Renders the main vertical navigation menu for the Dojo Management Suite.
 * Filters menu links dynamically based on the authenticated user's roles array.
 * 
 * @component
 * @returns {React.ReactElement} The filtered sidebar navigation structure.
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
   * Keeps items with no role restriction, or those matching at least one of the caller's roles.
   *
   * @param {MenuItem} item - Candidate navigation entry.
   * @returns {boolean} Whether the item is visible to the current user.
   */
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return userRoles.some((role) => item.allowedRoles?.includes(role));
  });

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-sidebar-border">
        {t('sidebar.title')}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent text-sidebar-foreground/80'
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