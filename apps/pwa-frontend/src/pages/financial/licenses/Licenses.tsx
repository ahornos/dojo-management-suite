/**
 * @file Licenses.tsx
 * @description Affiliation license history with expiry warning badges.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { translateApiError } from '@/lib/errors';
import { useFederations } from '../federations/useFederations';
import { LicenseStatusBadge } from './LicenseStatusBadge';
import { useLicenses } from './useLicenses';

/**
 * Staff view of issued licenses, with a link to the batch issuance wizard.
 *
 * @returns {JSX.Element} Licenses workspace.
 */
export default function Licenses() {
  const { t } = useTranslation();
  const { data: licenses = [], isLoading, error } = useLicenses();
  const { federations } = useFederations();
  const names = new Map(federations.map((federation) => [federation.id, federation.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('financial.licenses.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('financial.licenses.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/licenses/batch">{t('financial.licenses.open_wizard')}</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {translateApiError(t, error, 'financial.licenses.load_error')}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">{t('financial.licenses.loading')}</p>
        ) : licenses.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{t('financial.licenses.empty')}</p>
        ) : (
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_holder')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_role')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_federation')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_season')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_number')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_valid_until')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_amount')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.licenses.table_status')}</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">
                    {license.holder
                      ? `${license.holder.lastName}, ${license.holder.firstName}`
                      : license.studentProfileId ?? license.holderUserId}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t(`enums.license_holder.${license.holderType}`)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {names.get(license.federationId) ?? license.federationId}
                  </td>
                  <td className="px-4 py-3 text-foreground">{license.season}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{license.licenseNumber}</td>
                  <td className="px-4 py-3 text-foreground">
                    {new Date(license.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-foreground">{license.amountCharged ?? '—'}</td>
                  <td className="px-4 py-3">
                    <LicenseStatusBadge license={license} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
