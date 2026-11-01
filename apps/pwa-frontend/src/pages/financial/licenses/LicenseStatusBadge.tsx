/**
 * @file LicenseStatusBadge.tsx
 * @description Warning / expired / active badges for affiliation licenses.
 */

import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import type { AffiliationLicense } from './types';

interface LicenseStatusBadgeProps {
  license: AffiliationLicense;
}

/**
 * Badge for paid/active/expiring/expired license rows.
 *
 * @param {LicenseStatusBadgeProps} props - License row.
 * @returns {JSX.Element} Status badge.
 */
export function LicenseStatusBadge({ license }: LicenseStatusBadgeProps) {
  const { t } = useTranslation();
  const validUntil = new Date(license.validUntil).getTime();
  const expired = Number.isFinite(validUntil) && validUntil < Date.now();

  if (expired) {
    return <Badge variant="destructive">{t('financial.licenses.badge_expired')}</Badge>;
  }
  if (license.expiringSoon) {
    return <Badge variant="destructive">{t('financial.licenses.badge_expiring')}</Badge>;
  }
  if (!license.isPaid) {
    return <Badge variant="secondary">{t('financial.licenses.badge_unpaid')}</Badge>;
  }
  return <Badge variant="default">{t('financial.licenses.badge_active')}</Badge>;
}
