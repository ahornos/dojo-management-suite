/**
 * @file FederationFilters.tsx
 * @description Catalog toolbar: search plus lifecycle status (Activa / Inactiva / Eliminada).
 */

import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { FederationListStatus } from './types';

interface FederationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: FederationListStatus;
  onStatusChange: (value: FederationListStatus) => void;
  showDeletedOption: boolean;
  showClear: boolean;
  onClearFilters: () => void;
}

/**
 * Horizontal filter bar for the federation catalog (same pattern as the student directory).
 *
 * @param {FederationFiltersProps} props - Search, status, and clear handler.
 * @returns {JSX.Element} Toolbar.
 */
export function FederationFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  showDeletedOption,
  showClear,
  onClearFilters,
}: FederationFiltersProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm md:flex-row md:flex-wrap md:items-end">
      <div className="min-w-[12rem] flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="federation-search">
          {t('financial.federations.search_label')}
        </label>
        <Input
          id="federation-search"
          placeholder={t('financial.federations.search_placeholder')}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-9"
        />
      </div>

      <div className="w-full md:w-48">
        <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="federation-status">
          {t('financial.federations.filter_status')}
        </label>
        <Select
          id="federation-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as FederationListStatus)}
        >
          <option value="">{t('financial.federations.filter_status_all')}</option>
          <option value="ACTIVE">{t('financial.federations.filter_status_active')}</option>
          <option value="INACTIVE">{t('financial.federations.filter_status_inactive')}</option>
          {showDeletedOption ? (
            <option value="DELETED">{t('financial.federations.filter_status_deleted')}</option>
          ) : null}
        </Select>
      </div>

      {showClear ? (
        <Button type="button" variant="ghost" size="sm" className="h-9" onClick={onClearFilters}>
          <X className="h-4 w-4" />
          {t('financial.federations.clear_filters')}
        </Button>
      ) : null}
    </div>
  );
}
