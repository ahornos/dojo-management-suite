/**
 * @file Footer.tsx
 * @description Global footer component for the main layout.
 */

import { useTranslation } from 'react-i18next';

/**
 * Renders the application footer with dynamic copyright information and localized rights text.
 * 
 * @component
 * @returns {React.ReactElement} The footer element.
 */
export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Dojo Management Suite. {t('footer.rights')}</p>
    </footer>
  );
};