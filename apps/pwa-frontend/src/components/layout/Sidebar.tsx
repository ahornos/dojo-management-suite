/**
 * @file Sidebar.tsx
 * @description Grouped, RBAC-filtered sidebar with a persisted icon-only rail.
 */

import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  CalendarDays,
  ChevronDown,
  IdCard,
  Landmark,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  UserRound,
  Wallet,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { useAcademySettings } from '@/pages/settings/useAcademySettings';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
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

const SECTIONS_STORAGE_KEY = 'dms-sidebar-sections';

const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'dojo',
    titleKey: 'sidebar.section_dojo',
    items: [
      { nameKey: 'sidebar.dashboard', path: '/dashboard', icon: LayoutDashboard },
      { nameKey: 'sidebar.attendances', path: '/attendances', icon: CalendarDays },
      { nameKey: 'sidebar.graduations', path: '/graduations', icon: Landmark },
      {
        nameKey: 'sidebar.settings',
        path: '/settings',
        icon: Settings,
        allowedRoles: ['SUPER_ADMIN', 'ADMIN_STAFF'],
      },
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
        path: '/settings?tab=billing',
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
function isPathActive(pathname: string, search: string, path: string): boolean {
  const tab = new URLSearchParams(search).get('tab');
  if (path.startsWith('/settings?tab=')) {
    const targetTab = path.split('tab=')[1];
    return pathname === '/settings' && tab === targetTab;
  }
  if (path === '/settings') {
    return pathname === '/settings' && tab !== 'billing';
  }
  if (pathname === path) return true;
  if (path === '/dashboard') return false;
  return pathname.startsWith(`${path}/`);
}

/**
 * @returns {Record<string, boolean>} Persisted open/closed map.
 */
function readCollapsedState(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(SECTIONS_STORAGE_KEY);
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
  const { data: academy } = useAcademySettings();
  const userRoles = user?.roles ?? ['STUDENT'];
  const markUrl = academy?.isotypeUrl || academy?.logoUrl;
  const brandName = academy?.tradeName || academy?.brandName;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(readCollapsedState);
  const rail = useSidebarStore((state) => state.collapsed);
  const toggleRail = useSidebarStore((state) => state.toggleCollapsed);

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
      window.localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <aside
      id="dms-sidebar"
      data-collapsed={rail ? 'true' : 'false'}
      className={cn(
        'flex min-h-screen shrink-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-[width] duration-300',
        rail ? 'w-[4.5rem]' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex border-b border-sidebar-border transition-all duration-300',
          rail ? 'items-center justify-center px-2 py-4' : 'items-center gap-3 px-5 py-5',
        )}
      >
        {markUrl ? (
          <img
            src={markUrl}
            alt=""
            className="h-9 w-9 shrink-0 dms-control object-contain bg-sidebar-accent"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center dms-control bg-sidebar-accent text-sm font-bold">
            {(brandName || t('sidebar.title')).slice(0, 1)}
          </span>
        )}
        <span
          title={rail ? undefined : brandName || t('sidebar.title')}
          className={cn(
            'min-w-0 flex-1 text-xl font-bold leading-snug break-words [overflow-wrap:anywhere] line-clamp-2 transition-opacity duration-300',
            rail ? 'sr-only' : 'opacity-100',
          )}
        >
          {brandName || t('sidebar.title')}
        </span>
      </div>
      <nav className={cn('flex-1 space-y-4 p-3', rail ? 'overflow-visible' : 'overflow-y-auto')}>
        {sections.map((section) => {
          const isOpen = rail || collapsed[section.id] !== true;

          return (
            <section key={section.id}>
              {rail ? (
                <div className="mx-auto mb-1 h-px w-6 bg-sidebar-border" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  className="flex w-full items-center justify-between dms-control px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  aria-expanded={isOpen}
                  onClick={() => toggleSection(section.id)}
                >
                  <span>{t(section.titleKey)}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', !isOpen && '-rotate-90')} />
                </button>
              )}
              {isOpen ? (
                <ul className={cn(rail ? 'space-y-1' : 'mt-1 space-y-1')}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const label = t(item.nameKey);
                    const active = isPathActive(location.pathname, location.search, item.path);
                    const link = (
                      <Link
                        to={item.path}
                        title={rail ? label : undefined}
                        aria-label={rail ? label : undefined}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center dms-control text-sm font-medium transition-colors',
                          rail ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className={cn('truncate', rail && 'sr-only')}>{label}</span>
                      </Link>
                    );
                    return (
                      <li key={item.path}>
                        {rail ? (
                          <Tooltip content={label} side="right" className="w-full justify-center">
                            {link}
                          </Tooltip>
                        ) : (
                          link
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-sidebar-border p-2">
        <Tooltip content={rail ? t('sidebar.expand') : t('sidebar.collapse')} side={rail ? 'right' : 'top'} className="w-full">
          <button
            type="button"
            onClick={toggleRail}
            aria-expanded={!rail}
            aria-label={rail ? t('sidebar.expand') : t('sidebar.collapse')}
            className={cn(
              'flex w-full items-center dms-control py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground',
              rail ? 'justify-center px-0' : 'gap-3 px-3',
            )}
          >
            {rail ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className={cn(rail && 'sr-only')}>{t('sidebar.collapse')}</span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
