/**
 * @file Sidebar.tsx
 * @description Grouped, collapsible enterprise sidebar with RBAC filtering.
 */

import { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Award,
  Building2,
  CalendarDays,
  ChevronDown,
  IdCard,
  Landmark,
  LayoutDashboard,
  Users,
  UserRound,
  Wallet,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

interface MenuItem {
  nameKey: string;
  path: string;
  icon: typeof LayoutDashboard;
  allowedRoles?: string[];
}

interface MenuSection {
  id: string;
  titleKey: string;
  items: MenuItem[];
}

const STORAGE_KEY = 'dms-sidebar-sections';

const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'dojo',
    titleKey: 'sidebar.section_dojo',
    items: [
      { nameKey: 'sidebar.dashboard', path: '/dashboard', icon: LayoutDashboard },
      {
        nameKey: 'sidebar.disciplines',
        path: '/disciplines',
        icon: Award,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF', 'SPORTS_TECHNICAL_DIRECTOR'],
      },
      { nameKey: 'sidebar.attendances', path: '/attendances', icon: CalendarDays },
      { nameKey: 'sidebar.graduations', path: '/graduations', icon: Landmark },
    ],
  },
  {
    id: 'community',
    titleKey: 'sidebar.section_community',
    items: [
      {
        nameKey: 'sidebar.users',
        path: '/users',
        icon: Users,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'],
      },
      {
        nameKey: 'sidebar.students',
        path: '/students',
        icon: UserRound,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF', 'INSTRUCTOR'],
      },
    ],
  },
  {
    id: 'finance',
    titleKey: 'sidebar.section_finance',
    items: [
      {
        nameKey: 'sidebar.financial',
        path: '/financial/config',
        icon: Wallet,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'],
      },
    ],
  },
  {
    id: 'federative',
    titleKey: 'sidebar.section_federative',
    items: [
      {
        nameKey: 'sidebar.federations',
        path: '/federations',
        icon: Building2,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'],
      },
      {
        nameKey: 'sidebar.licenses',
        path: '/licenses',
        icon: IdCard,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'],
      },
    ],
  },
];

/**
 * @param {string} pathname - Current location.
 * @param {string} path - Menu target.
 * @returns {boolean} Whether the item should appear active.
 */
function isPathActive(pathname: string, path: string): boolean {
  if (pathname === path) return true;
  if (path === '/dashboard') return false;
  return pathname.startsWith(`${path}/`);
}

/**
 * @returns {Record<string, boolean>} Persisted open/closed map.
 */
function readCollapsedState(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

/**
 * Grouped sidebar. Empty sections (no visible items after RBAC) are omitted.
 *
 * @returns {JSX.Element} Filtered navigation.
 */
export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.roles ?? ['STUDENT'];
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(readCollapsedState);

  /**
   * @param {MenuItem} item - Candidate entry.
   * @returns {boolean} Whether the caller may see the item.
   */
  const canSee = (item: MenuItem): boolean => {
    if (!item.allowedRoles) return true;
    return userRoles.some((role) => item.allowedRoles?.includes(role));
  };

  const sections = useMemo(
    () =>
      MENU_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(canSee),
      })).filter((section) => section.items.length > 0),
    [userRoles.join('|')],
  );

  /**
   * @param {string} sectionId - Section key.
   * @returns {void}
   */
  const toggleSection = (sectionId: string): void => {
    setCollapsed((current) => {
      const next = { ...current, [sectionId]: !current[sectionId] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border p-6 text-2xl font-bold">{t('sidebar.title')}</div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {sections.map((section) => {
          const isOpen = collapsed[section.id] !== true;

          return (
            <section key={section.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/60 hover:text-sidebar-foreground"
                aria-expanded={isOpen}
                onClick={() => toggleSection(section.id)}
              >
                <span>{t(section.titleKey)}</span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', !isOpen && '-rotate-90')} />
              </button>
              {isOpen ? (
                <ul className="mt-1 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={() => {
                            const active = isPathActive(location.pathname, item.path);
                            return cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                              active
                                ? 'bg-primary text-primary-foreground'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent',
                            );
                          }}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{t(item.nameKey)}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
