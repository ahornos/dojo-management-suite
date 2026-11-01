/**
 * @file Header.tsx
 * @description Top navigation bar containing the sidebar rail toggle, brand, 
 * language switcher, and logout functionality.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useAcademySettings } from '@/pages/settings/useAcademySettings';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';

/**
 * Renders the top header of the application layout.
 * Displays the authenticated user's dynamic info, a language switcher dropdown, and a logout action.
 * 
 * @component
 * @returns {React.ReactElement} The application header.
 */
export const Header = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const sidebarCollapsed = useSidebarStore((state) => state.collapsed);
  const toggleSidebar = useSidebarStore((state) => state.toggleCollapsed);
  const { data: academy } = useAcademySettings();
  const brandName = academy?.tradeName || academy?.brandName || academy?.displayName;
  const sidebarToggleLabel = sidebarCollapsed ? t('sidebar.expand') : t('sidebar.collapse');

  /**
   * Handles the language change event triggered by the select dropdown.
   */
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
  };

  /**
   * Clears the user session by removing the token, clearing the store, 
   * and redirecting the user to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  /**
   * Builds avatar initials from the authenticated user, falling back to the localized admin label.
   *
   * @returns {string} Two-character initials.
   */
  const getUserInitials = () => {
    if (!user?.firstName && !user?.lastName && !user?.email) {
      return t('header.fallback_name').substring(0, 2).toUpperCase();
    }
    const identifier = (user.firstName ? `${user.firstName} ${user.lastName}` : user.email);
    return identifier.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-topbar text-topbar-foreground border-b border-border h-16 flex items-center justify-between px-4 shadow-[var(--shadow-card)] sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Tooltip content={sidebarToggleLabel}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-expanded={!sidebarCollapsed}
            aria-controls="dms-sidebar"
            aria-label={sidebarToggleLabel}
            className="shrink-0 text-topbar-foreground hover:bg-accent"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </Tooltip>
        {academy?.logoUrl ? (
          <img src={academy.logoUrl} alt="" className="h-8 max-w-[10rem] object-contain" />
        ) : null}
        <h2 className="truncate text-xl font-semibold">
          {brandName || t('header.control_panel')}
        </h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm text-muted-foreground font-medium">
            {t('header.language')}
          </label>
          <select
            id="language-select"
            value={i18n.language ? i18n.language.substring(0, 2) : 'es'}
            onChange={handleLanguageChange}
            className="text-sm bg-muted border border-input dms-control px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="es">{t('header.lang_es')}</option>
            <option value="ca">{t('header.lang_ca')}</option>
            <option value="en">{t('header.lang_en')}</option>
          </select>
        </div>

        <div className="flex items-center gap-3 border-l pl-6 border-border">
          <div className="text-sm text-right">
            <p className="font-bold text-foreground">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : t('header.fallback_name')}
            </p>
            {user?.email && (
              <p className="text-muted-foreground text-xs">{user.email}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
            {getUserInitials()}
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 dms-control transition-colors font-medium"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};