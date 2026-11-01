/**
 * @file BatchWizard.tsx
 * @description Massive affiliation-license issuance: filter, preview, then issue licenses + charges.
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { LICENSE_HOLDER_TYPES, type LicenseHolderType } from '@/lib/domain-enums';
import { translateApiError } from '@/lib/errors';
import { useDisciplines } from '@/pages/disciplines/useDisciplines';
import { useCreateFederationCharges, useFederations } from '../federations/useFederations';
import { currentSeason } from '../season';
import type { LicensePreviewFilters, LicensePreviewHolder } from './types';
import { useLicenseBatch } from './useLicenses';

/**
 * Sale amount charged to the member for the selected holder type and license product.
 *
 * @param {import('../federations/types').Federation | undefined} federation - Catalog row.
 * @param {string} seasonName - Selected season label.
 * @param {LicenseHolderType} holderType - Student or staff.
 * @param {string} licenseTypeId - Explicit type, if any.
 * @returns {string} Decimal string.
 */
function salePriceFor(
  federation: import('../federations/types').Federation | undefined,
  seasonName: string,
  holderType: LicenseHolderType,
  licenseTypeId: string,
): string {
  const types = licenseTypesForSeason(federation, seasonName);
  const typed = types.find((type) => type.id === licenseTypeId) ?? types[0];
  const kind = holderType === 'STUDENT' ? 'ADULT' : 'INSTRUCTOR';
  return typed?.priceRows.find((row) => row.kind === kind)?.chargePrice ?? '0.00';
}

/**
 * @param {import('../federations/types').Federation | undefined} federation - Catalog row.
 * @param {string} seasonName - Selected season.
 * @returns {NonNullable<import('../federations/types').Federation['seasons']>[number]['licenseTypes']} Active types.
 */
function licenseTypesForSeason(
  federation: import('../federations/types').Federation | undefined,
  seasonName: string,
) {
  const seasons = federation?.seasons ?? [];
  const season =
    seasons.find((row) => row.seasonName === seasonName && row.isActive) ??
    seasons.find((row) => row.seasonName === seasonName) ??
    seasons.find((row) => row.isActive);
  return (season?.licenseTypes ?? []).filter((type) => type.isActive);
}

/**
 * Wizard: filters → preview table → one-click academic batch + financial charges.
 *
 * @returns {JSX.Element} Batch issuance workspace.
 */
export default function BatchWizard() {
  const { t } = useTranslation();
  const { federations } = useFederations();
  const { disciplines } = useDisciplines();
  const { preview, issueBatch } = useLicenseBatch();
  const charges = useCreateFederationCharges();

  const [federationId, setFederationId] = useState('');
  const [season, setSeason] = useState(currentSeason());
  const [holderType, setHolderType] = useState<LicenseHolderType>('STUDENT');
  const [age, setAge] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [enrollmentDateBefore, setEnrollmentDateBefore] = useState('');
  const [includeClubFee, setIncludeClubFee] = useState(true);
  const [licenseTypeId, setLicenseTypeId] = useState('');
  const [holders, setHolders] = useState<LicensePreviewHolder[] | null>(null);

  const federation = federations.find((row) => row.id === federationId);
  const licenseTypes = licenseTypesForSeason(federation, season);
  const pending = holders?.filter((holder) => !holder.alreadyLicensed) ?? [];
  const amountCharged = salePriceFor(federation, season, holderType, licenseTypeId);

  const filters = useMemo<LicensePreviewFilters | null>(() => {
    if (!federationId || !/^\d{4}-\d{4}$/.test(season)) return null;
    return {
      federationId,
      season,
      holderType,
      ...(age.trim() !== '' ? { age: Number.parseInt(age, 10) } : {}),
      ...(disciplineId ? { disciplineId } : {}),
      ...(enrollmentDateBefore ? { enrollmentDateBefore } : {}),
      ...(licenseTypeId ? { licenseTypeId } : {}),
    };
  }, [federationId, season, holderType, age, disciplineId, enrollmentDateBefore, licenseTypeId]);

  /**
   * Loads matching holders without writing.
   *
   * @returns {void}
   */
  const onPreview = () => {
    if (!filters) return;
    preview.mutate(filters, {
      onSuccess: (data) => setHolders(data.holders),
    });
  };

  /**
   * Issues academic licenses, then posts financial seasonal charges (2-step orchestration).
   *
   * @returns {void}
   */
  const onGenerate = () => {
    if (!filters) return;
    issueBatch.mutate(
      { ...filters, amountCharged },
      {
        onSuccess: (result) => {
          const chargeHolders = result.licenses.map((license) => ({
            holderType: license.holderType,
            holderUserId: license.holderUserId,
            studentProfileId: license.studentProfileId ?? undefined,
            licenseId: license.id,
          }));
          charges.mutate({
            federationId: filters.federationId,
            season: filters.season,
            includeClubFee,
            holders: chargeHolders,
          });
        },
      },
    );
  };

  const actionError = preview.error ?? issueBatch.error ?? charges.error;
  const generateDisabled =
    !filters || issueBatch.isPending || charges.isPending || (holders !== null && pending.length === 0 && !includeClubFee);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('financial.licenses.wizard_title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('financial.licenses.wizard_subtitle')}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/licenses">{t('financial.licenses.back_to_list')}</Link>
        </Button>
      </div>

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {translateApiError(t, actionError, 'financial.licenses.wizard_error')}
        </p>
      ) : null}
      {issueBatch.isSuccess ? (
        <p className="rounded-md border border-border bg-muted p-3 text-sm text-foreground" role="status">
          {t('financial.licenses.wizard_done', {
            created: issueBatch.data.created,
            skipped: issueBatch.data.skipped,
            charges: charges.data?.created ?? 0,
          })}
        </p>
      ) : null}

      <FormSection
        title={t('financial.licenses.filters_title')}
        description={t('financial.licenses.filters_help')}
      >
        <FormGrid>
          <div className="space-y-2">
            <Label htmlFor="wizard-federation">{t('financial.licenses.filter_federation')}</Label>
            <Select
              id="wizard-federation"
              value={federationId}
              onChange={(event) => {
                setFederationId(event.target.value);
                setLicenseTypeId('');
                setHolders(null);
              }}
            >
              <option value="">{t('financial.licenses.filter_federation_placeholder')}</option>
              {federations
                .filter((row) => row.isActive)
                .map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-season">{t('financial.licenses.filter_season')}</Label>
            <Input
              id="wizard-season"
              value={season}
              onChange={(event) => {
                setSeason(event.target.value);
                setHolders(null);
              }}
              placeholder="2026-2027"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-role">{t('financial.licenses.filter_role')}</Label>
            <Select
              id="wizard-role"
              value={holderType}
              onChange={(event) => {
                setHolderType(event.target.value as LicenseHolderType);
                setLicenseTypeId('');
                setHolders(null);
              }}
            >
              {LICENSE_HOLDER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`enums.license_holder.${type}`)}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-license-type">{t('financial.licenses.filter_license_type')}</Label>
            <Select
              id="wizard-license-type"
              value={licenseTypeId}
              disabled={licenseTypes.length === 0}
              onChange={(event) => {
                setLicenseTypeId(event.target.value);
                setHolders(null);
              }}
            >
              <option value="">{t('financial.licenses.filter_license_type_all')}</option>
              {licenseTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-age">{t('financial.licenses.filter_age')}</Label>
            <Input
              id="wizard-age"
              type="number"
              min={0}
              value={age}
              onChange={(event) => {
                setAge(event.target.value);
                setHolders(null);
              }}
              placeholder={t('financial.licenses.filter_age_placeholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-discipline">{t('financial.licenses.filter_discipline')}</Label>
            <Select
              id="wizard-discipline"
              value={disciplineId}
              disabled={holderType !== 'STUDENT'}
              onChange={(event) => {
                setDisciplineId(event.target.value);
                setHolders(null);
              }}
            >
              <option value="">{t('financial.licenses.filter_discipline_all')}</option>
              {(disciplines as Array<{ id: string; name: string }> | undefined)?.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-enrolled">{t('financial.licenses.filter_enrolled_before')}</Label>
            <Input
              id="wizard-enrolled"
              type="date"
              value={enrollmentDateBefore}
              disabled={holderType !== 'STUDENT'}
              onChange={(event) => {
                setEnrollmentDateBefore(event.target.value);
                setHolders(null);
              }}
            />
          </div>
        </FormGrid>
        <div className="flex items-start gap-2 pt-2">
          <Checkbox
            id="wizard-club"
            checked={includeClubFee}
            onChange={(event) => setIncludeClubFee(event.target.checked)}
          />
          <Label htmlFor="wizard-club" className="font-normal text-muted-foreground">
            {t('financial.licenses.include_club_fee')}
          </Label>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="button" variant="outline" disabled={!filters || preview.isPending} onClick={onPreview}>
            {preview.isPending ? t('financial.licenses.previewing') : t('financial.licenses.preview')}
          </Button>
          <Button type="button" disabled={generateDisabled} onClick={onGenerate}>
            {issueBatch.isPending || charges.isPending
              ? t('financial.licenses.generating')
              : t('financial.licenses.generate')}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('financial.licenses.sale_hint', { amount: amountCharged })}
        </p>
      </FormSection>

      {holders ? (
        <FormSection title={t('financial.licenses.preview_title', { count: holders.length, pending: pending.length })}>
          {holders.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('financial.licenses.preview_empty')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4 font-medium">{t('financial.licenses.table_holder')}</th>
                    <th className="py-2 pr-4 font-medium">{t('financial.licenses.filter_age')}</th>
                    <th className="py-2 pr-4 font-medium">{t('financial.licenses.filter_license_type')}</th>
                    <th className="py-2 font-medium">{t('financial.licenses.table_status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.map((holder) => (
                    <tr key={holder.studentProfileId ?? holder.holderUserId} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 text-foreground">
                        {holder.lastName}, {holder.firstName}
                        <span className="ml-2 text-xs text-muted-foreground">{holder.email}</span>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">{holder.age ?? '—'}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{holder.suggestedLicenseTypeName ?? '—'}</td>
                      <td className="py-2 text-muted-foreground">
                        {holder.alreadyLicensed
                          ? t('financial.licenses.already_licensed')
                          : t('financial.licenses.pending')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FormSection>
      ) : null}
    </div>
  );
}
