/**
 * @file SettingsFeedback.tsx
 * @description Shared success/error line for academy settings forms.
 */

import { useTranslation } from 'react-i18next';
import { translateApiError } from '@/lib/errors';

/**
 * Shared API feedback line.
 *
 * @param {object} props - Error, success, and fallback key.
 * @returns {JSX.Element | null} Status text.
 */
export function SettingsFeedback({
  error,
  success,
  fallback,
}: {
  error?: unknown;
  success?: boolean;
  fallback: string;
}): JSX.Element | null {
  const { t } = useTranslation();
  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {translateApiError(t, error, fallback)}
      </p>
    );
  }
  if (success) {
    return <p className="text-sm text-muted-foreground">{t('settings.saved')}</p>;
  }
  return null;
}
