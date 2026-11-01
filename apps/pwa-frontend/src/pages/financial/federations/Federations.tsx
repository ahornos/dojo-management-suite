/**
 * @file Federations.tsx
 * @description Tenant federation catalog list with filters, expandable rows, and icon actions.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { translateApiError } from '@/lib/errors';
import { useAuthStore } from '@/store/useAuthStore';
import { DeleteFederationModal } from './DeleteFederationModal';
import { FederationFilters } from './FederationFilters';
import { FederationTableRow } from './FederationTableRow';
import { PriceListModal } from './PriceListModal';
import { useFederations } from './useFederations';
import type { Federation, FederationListStatus } from './types';

/**
 * Staff catalog of federations used for affiliation licenses and seasonal payouts.
 *
 * @returns {JSX.Element} Federations workspace.
 */
export default function Federations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const roles = useAuthStore((state) => state.user?.roles) ?? [];
  const isSuperAdmin = roles.includes('SUPER_ADMIN');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<FederationListStatus>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [priceListTarget, setPriceListTarget] = useState<Federation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Federation | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const filters = useMemo(() => ({ q: debouncedSearch, status }), [debouncedSearch, status]);
  const {
    federations,
    isLoading,
    error,
    activateFederation,
    deactivateFederation,
    deleteFederation,
  } = useFederations(true, filters);

  const showClear = searchTerm.trim() !== '' || status !== '';
  const isToggling = activateFederation.isPending || deactivateFederation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('financial.federations.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('financial.federations.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => navigate('/federations/new')}>
            {t('financial.federations.new')}
          </Button>
        </div>
      </div>

      <FederationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={setStatus}
        showDeletedOption={isSuperAdmin}
        showClear={showClear}
        onClearFilters={() => {
          setSearchTerm('');
          setStatus('');
        }}
      />

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {translateApiError(t, error, 'financial.federations.load_error')}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">{t('financial.federations.loading')}</p>
        ) : federations.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            {showClear ? t('financial.federations.empty_filtered') : t('financial.federations.empty')}
          </p>
        ) : (
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t('financial.federations.table_name')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.federations.acronym')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.federations.country')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.federations.email')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.federations.table_seasons')}</th>
                <th className="px-4 py-3 font-medium">{t('financial.federations.table_status')}</th>
                <th className="px-4 py-3 text-right font-medium">{t('financial.federations.table_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {federations.map((federation) => (
                <FederationTableRow
                  key={federation.id}
                  federation={federation}
                  expanded={expandedId === federation.id}
                  isSuperAdmin={isSuperAdmin}
                  isToggling={isToggling}
                  onToggle={() => setExpandedId((current) => (current === federation.id ? null : federation.id))}
                  onEdit={() => navigate(`/federations/${federation.id}/edit`)}
                  onActivate={() => activateFederation.mutate(federation.id)}
                  onDeactivate={() => deactivateFederation.mutate(federation.id)}
                  onDelete={() => setDeleteTarget(federation)}
                  onOpenPriceList={() => setPriceListTarget(federation)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PriceListModal federation={priceListTarget} onClose={() => setPriceListTarget(null)} />
      <DeleteFederationModal
        federation={deleteTarget}
        isPending={deleteFederation.isPending}
        onClose={() => setDeleteTarget(null)}
        onSoftDelete={() => {
          if (!deleteTarget) return;
          deleteFederation.mutate(
            { id: deleteTarget.id, mode: 'soft' },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
        onHardDelete={() => {
          if (!deleteTarget) return;
          deleteFederation.mutate(
            { id: deleteTarget.id, mode: 'hard' },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
      />
    </div>
  );
}
