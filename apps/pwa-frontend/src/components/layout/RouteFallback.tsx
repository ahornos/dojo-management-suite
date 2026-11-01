/**
 * @file RouteFallback.tsx
 * @description Suspense placeholder while a lazy route chunk loads.
 */

import { useTranslation } from 'react-i18next';

/**
 * Lightweight loading copy for code-split route modules.
 *
 * @returns {JSX.Element} Loading status.
 */
export function RouteFallback(): JSX.Element {
  const { t } = useTranslation();
  return <div className="p-6 text-muted-foreground">{t('common.loading')}</div>;
}
