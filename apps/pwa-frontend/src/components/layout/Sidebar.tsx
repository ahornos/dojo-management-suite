/**
 * @file Sidebar.tsx
 * @description Navigation sidebar component for the main layout.
 * Includes internationalization support for menu items.
 */

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Renders the main vertical navigation menu for the Dojo Management Suite.
 * Highlights the currently active route and translates the menu items dynamically.
 * 
 * @component
 * @returns {React.ReactElement} The sidebar navigation structure.
 */
export const Sidebar = () => {
  const { t } = useTranslation();

  /**
   * List of navigation items utilizing the translation function 't'.
   */
  const menuItems = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: '📊' },
    { name: t('sidebar.users'), path: '/users', icon: '👥' },
    { name: t('sidebar.students'), path: '/students', icon: '🥋' },
    { name: t('sidebar.attendances'), path: '/attendances', icon: '📅' },
    { name: t('sidebar.graduations'), path: '/graduations', icon: '⭐' },
    { name: t('sidebar.financial'), path: '/financial', icon: '💰' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        {t('sidebar.title')}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
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