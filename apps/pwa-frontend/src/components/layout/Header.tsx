/**
 * @file Header.tsx
 * @description Top navigation bar containing dynamic user profile information, 
 * language switcher, and logout functionality.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';

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
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">{t('header.control_panel')}</h2>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm text-muted-foreground font-medium">
            {t('header.language')}
          </label>
          <select
            id="language-select"
            value={i18n.language ? i18n.language.substring(0, 2) : 'es'}
            onChange={handleLanguageChange}
            className="text-sm bg-muted border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="ml-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors font-medium"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};