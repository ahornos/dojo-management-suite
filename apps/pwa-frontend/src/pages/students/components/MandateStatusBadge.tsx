/**
 * @file MandateStatusBadge.tsx
 * @description Visual SEPA clickwrap status: pending (warning) vs digitally signed (primary).
 */

import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import type { BankMandate } from '../types';

interface MandateStatusBadgeProps {
  mandate: BankMandate;
}

/**
 * Formats the clickwrap timestamp for the signed badge.
 *
 * @param {string} iso - ISO-8601 timestamp from `signedAt`.
 * @param {string} locale - Active i18n language.
 * @returns {string} Localized date and time.
 */
function formatSignedAt(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' });
}

/**
 * Yellow pending vs green-primary signed badge for the student banking profile.
 *
 * @param {MandateStatusBadgeProps} props - Mandate whose `isSigned` drives the variant.
 * @returns {JSX.Element} Status badge.
 */
export function MandateStatusBadge({ mandate }: MandateStatusBadgeProps) {
  const { t, i18n } = useTranslation();

  if (mandate.isSigned && mandate.signedAt) {
    return (
      <Badge className="border-transparent bg-primary text-primary-foreground hover:bg-primary/90">
        {t('students.sepa.badge_signed', { date: formatSignedAt(mandate.signedAt, i18n.language) })}
      </Badge>
    );
  }

  return (
    <Badge className="border-transparent bg-warning text-warning-foreground hover:bg-warning/90">
      {t('students.sepa.badge_pending')}
    </Badge>
  );
}
