/**
 * @file Dashboard.tsx
 * @description Private home with affiliation-license expiry alerts for academy staff.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatLocalizedDate } from '@/components/ui/localized-date';
import { useAuthStore } from '@/store/useAuthStore';
import { federationShortName, licenseHolderName } from '@/pages/financial/licenses/licenseDisplay';
import { useExpiringLicenses } from '@/pages/financial/licenses/useLicenses';
import { useFederations } from '@/pages/financial/federations/useFederations';

const STAFF_ALERT_ROLES = ['SUPER_ADMIN', 'ADMIN_STAFF'];

/**
 * Dashboard landing plus a 30-day license expiry banner for ADMIN_STAFF / SUPER_ADMIN.
 *
 * @returns {JSX.Element} Dashboard view.
 */
export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const roles = useAuthStore((state) => state.user?.roles) ?? [];
  const canSeeAlerts = roles.some((role) => STAFF_ALERT_ROLES.includes(role));
  const { data: expiring = [] } = useExpiringLicenses(canSeeAlerts);
  const { federations } = useFederations(canSeeAlerts);
  const catalog = new Map(federations.map((federation) => [federation.id, federation]));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.welcome')}</h1>
      </div>

      {canSeeAlerts && expiring.length > 0 ? (
        <section
          className="rounded-lg border border-destructive/40 bg-card p-6 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold text-foreground">{t('dashboard.expiring_title', { count: expiring.length })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.expiring_help')}</p>
          <ul className="mt-4 space-y-2">
            {expiring.slice(0, 8).map((license) => (
              <li key={license.id} className="text-sm text-foreground">
                {licenseHolderName(license) || '—'}
                {' · '}
                {federationShortName(catalog.get(license.federationId)) || license.federationId}
                {' · '}
                {t('dashboard.expires_on', { date: formatLocalizedDate(license.validUntil, i18n.language) })}
              </li>
            ))}
          </ul>
          <Link to="/licenses" className="mt-4 inline-block text-sm font-medium text-primary underline">
            {t('dashboard.expiring_cta')}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
