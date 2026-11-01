/**
 * @file BatchWizard.tsx
 * @description Massive affiliation-license issuance: filter, preview, select students, then batch-issue.
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateInput } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { LICENSE_HOLDER_TYPES, type LicenseHolderType } from '@/lib/domain-enums';
import { translateApiError } from '@/lib/errors';
import { useDisciplines } from '@/pages/disciplines/useDisciplines';
import { AGE_GROUPS } from '@/pages/students/config/ageGroups';
import { MultiSelectFilter } from '@/pages/students/components/MultiSelectFilter';
import { useCreateFederationCharges, useFederations } from '../federations/useFederations';
import type { Federation, FederationSeason } from '../federations/types';
import { currentSeason } from '../season';
import { BatchResultModal } from './BatchResultModal';
import type { LicensePreviewFilters, LicensePreviewHolder, SelectedLicenseBatchResult } from './types';
import { useBatchIssueLicenses, useLicenseBatch } from './useLicenses';

/**
 * Active catalog seasons for the selected federation.
 *
 * @param {Federation | undefined} federation - Catalog row.
 * @returns {FederationSeason[]} Seasons with an id.
 */
function seasonsForFederation(federation: Federation | undefined): FederationSeason[] {
  return (federation?.seasons ?? []).filter((season): season is FederationSeason & { id: string } => Boolean(season.id));
}

/**
 * Resolves the catalog season from id, then from label.
 *
 * @param {Federation | undefined} federation - Catalog row.
 * @param {string} seasonId - Explicit season id.
 * @param {string} seasonName - Season label.
 * @returns {FederationSeason | undefined} Matching season.
 */
function resolveSeason(
  federation: Federation | undefined,
  seasonId: string,
  seasonName: string,
): FederationSeason | undefined {
  const seasons = seasonsForFederation(federation);
  return seasons.find((row) => row.id === seasonId) ?? seasons.find((row) => row.seasonName === seasonName);
}

/**
 * Active license types for the selected season.
 *
 * @param {FederationSeason | undefined} season - Catalog season.
 * @returns {NonNullable<FederationSeason['licenseTypes']>} Active types.
 */
function licenseTypesForSeason(season: FederationSeason | undefined) {
  return (season?.licenseTypes ?? []).filter((type) => type.isActive && Boolean(type.id));
}

/**
 * Catalog sale price for the selected holder type and license product.
 *
 * @param {FederationSeason | undefined} season - Catalog season.
 * @param {LicenseHolderType} holderType - Student or staff.
 * @param {string} licenseTypeId - Explicit type, if any.
 * @returns {string} Decimal string.
 */
function salePriceFor(
  season: FederationSeason | undefined,
  holderType: LicenseHolderType,
  licenseTypeId: string,
): string {
  const types = licenseTypesForSeason(season);
  const typed = types.find((type) => type.id === licenseTypeId) ?? types[0];
  const kind = holderType === 'STUDENT' ? 'ADULT' : 'INSTRUCTOR';
  return typed?.priceRows.find((row) => row.kind === kind)?.chargePrice ?? '0.00';
}

/**
 * Preview rows that can be sent to the selected-student engine.
 *
 * @param {LicensePreviewHolder} holder - Preview row.
 * @returns {boolean} Whether the row has a profile id and is not already licensed.
 */
function isSelectableStudent(holder: LicensePreviewHolder): boolean {
  return Boolean(holder.studentProfileId) && !holder.alreadyLicensed;
}

const WIZARD_STATUSES = ['ACTIVE', 'TRIAL', 'PAUSED'] as const;
const AGE_CUSTOM = 'custom';

/**
 * Wizard: filters → preview table with multi-select → selected-student batch (or staff filter batch).
 *
 * @returns {JSX.Element} Batch issuance workspace.
 */
export default function BatchWizard() {
  const { t } = useTranslation();
  const { federations } = useFederations();
  const { disciplines } = useDisciplines();
  const { preview, issueBatch } = useLicenseBatch();
  const issueSelected = useBatchIssueLicenses();
  const charges = useCreateFederationCharges();

  const [federationId, setFederationId] = useState('');
  const [seasonId, setSeasonId] = useState('');
  const [season, setSeason] = useState(currentSeason());
  const [holderType, setHolderType] = useState<LicenseHolderType>('STUDENT');
  const [statuses, setStatuses] = useState<string[]>(['ACTIVE']);
  const [ageBracket, setAgeBracket] = useState('');
  const [birthYearFrom, setBirthYearFrom] = useState('');
  const [birthYearTo, setBirthYearTo] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [enrollmentDateBefore, setEnrollmentDateBefore] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [includeClubFee, setIncludeClubFee] = useState(true);
  const [licenseTypeId, setLicenseTypeId] = useState('');
  const [holders, setHolders] = useState<LicensePreviewHolder[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchResult, setBatchResult] = useState<SelectedLicenseBatchResult | null>(null);

  const federation = federations.find((row) => row.id === federationId);
  const catalogSeasons = seasonsForFederation(federation);
  const selectedSeason = resolveSeason(federation, seasonId, season);
  const licenseTypes = licenseTypesForSeason(selectedSeason);
  const pending = holders?.filter((holder) => !holder.alreadyLicensed) ?? [];
  const selectable = (holders ?? []).filter(isSelectableStudent);
  const amountCharged = salePriceFor(selectedSeason, holderType, licenseTypeId);
  const isStudentBatch = holderType === 'STUDENT';
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelectableChecked = selectable.length > 0 && selectable.every((holder) => selectedSet.has(holder.studentProfileId as string));

  const filters = useMemo<LicensePreviewFilters | null>(() => {
    const seasonLabel = (selectedSeason?.seasonName ?? season).trim();
    if (!federationId || !seasonLabel) return null;
    const group = AGE_GROUPS.find((row) => row.id === ageBracket);
    const yearFrom = Number.parseInt(birthYearFrom, 10);
    const yearTo = Number.parseInt(birthYearTo, 10);
    return {
      federationId,
      season: seasonLabel,
      holderType,
      statuses: (statuses.length > 0 ? statuses : ['ACTIVE']) as LicensePreviewFilters['statuses'],
      ...(group ? { minAge: group.minAge, ...(group.maxAge < 999 ? { maxAge: group.maxAge } : {}) } : {}),
      ...(ageBracket === AGE_CUSTOM && Number.isFinite(yearFrom) ? { birthYearFrom: yearFrom } : {}),
      ...(ageBracket === AGE_CUSTOM && Number.isFinite(yearTo) ? { birthYearTo: yearTo } : {}),
      ...(disciplineId ? { disciplineId } : {}),
      ...(enrollmentDateBefore ? { enrollmentDateBefore } : {}),
      ...(licenseTypeId ? { licenseTypeId } : {}),
    };
  }, [
    federationId,
    selectedSeason,
    season,
    holderType,
    statuses,
    ageBracket,
    birthYearFrom,
    birthYearTo,
    disciplineId,
    enrollmentDateBefore,
    licenseTypeId,
  ]);

  /**
   * Applies a newly selected federation: first active season and cleared preview.
   *
   * @param {string} nextFederationId - Catalog federation id.
   * @returns {void}
   */
  const onFederationChange = (nextFederationId: string) => {
    const next = federations.find((row) => row.id === nextFederationId);
    const first = seasonsForFederation(next).find((row) => row.isActive) ?? seasonsForFederation(next)[0];
    setFederationId(nextFederationId);
    setSeasonId(first?.id ?? '');
    setSeason(first?.seasonName ?? currentSeason());
    setLicenseTypeId('');
    setHolders(null);
    setSelectedIds([]);
  };

  /**
   * Loads matching holders without writing and pre-selects pending students.
   *
   * @returns {void}
   */
  const onPreview = () => {
    if (!filters) return;
    preview.mutate(filters, {
      onSuccess: (data) => {
        setHolders(data.holders);
        setSelectedIds(
          data.holders.filter(isSelectableStudent).map((holder) => holder.studentProfileId as string),
        );
      },
    });
  };

  /**
   * Toggles one selectable student in the issuance set.
   *
   * @param {string} studentProfileId - Academic profile id.
   * @param {boolean} checked - Whether the row is selected.
   * @returns {void}
   */
  const onToggleStudent = (studentProfileId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, studentProfileId])] : current.filter((id) => id !== studentProfileId),
    );
  };

  /**
   * Selects or clears every pending student in the current preview.
   *
   * @param {boolean} checked - Select-all state.
   * @returns {void}
   */
  const onToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? selectable.map((holder) => holder.studentProfileId as string) : []);
  };

  /**
   * Issues selected student licenses via the new engine, or staff licenses via the filter batch.
   *
   * @returns {void}
   */
  const onGenerate = () => {
    if (isStudentBatch) {
      if (!federationId || !licenseTypeId || selectedIds.length === 0) return;
      issueSelected.mutate(
        {
          federationId,
          ...(seasonId ? { seasonId } : {}),
          seasonName: selectedSeason?.seasonName ?? season,
          licenseTypeId,
          studentProfileIds: selectedIds,
        },
        {
          onSuccess: (result) => {
            setBatchResult(result);
            if (filters) {
              preview.mutate(filters, {
                onSuccess: (data) => {
                  setHolders(data.holders);
                  setSelectedIds([]);
                },
              });
            }
          },
        },
      );
      return;
    }

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
          setBatchResult({
            totalProcessed: result.created + result.skipped,
            successCount: result.created,
            skippedCount: result.skipped,
            skippedDetails: (result.warnings ?? [])
              .filter((warning) => warning.studentProfileId)
              .map((warning) => ({
                studentId: warning.studentProfileId as string,
                reason: warning.code,
              })),
          });
        },
      },
    );
  };

  const actionError = preview.error ?? issueBatch.error ?? issueSelected.error ?? charges.error;
  const isIssuing = issueBatch.isPending || issueSelected.isPending || charges.isPending;
  const generateDisabled = isStudentBatch
    ? !federationId || !licenseTypeId || selectedIds.length === 0 || isIssuing || holders === null
    : !filters || isIssuing || (holders !== null && pending.length === 0 && !includeClubFee);

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
              onChange={(event) => onFederationChange(event.target.value)}
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
            {catalogSeasons.length > 0 ? (
              <Select
                id="wizard-season"
                value={seasonId}
                onChange={(event) => {
                  const next = catalogSeasons.find((row) => row.id === event.target.value);
                  setSeasonId(event.target.value);
                  setSeason(next?.seasonName ?? '');
                  setLicenseTypeId('');
                  setHolders(null);
                  setSelectedIds([]);
                }}
              >
                <option value="">{t('financial.licenses.filter_season_placeholder')}</option>
                {catalogSeasons.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.seasonName}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id="wizard-season"
                value={season}
                onChange={(event) => {
                  setSeason(event.target.value);
                  setSeasonId('');
                  setHolders(null);
                  setSelectedIds([]);
                }}
                placeholder="2026-2027"
              />
            )}
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
                setSelectedIds([]);
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
                setSelectedIds([]);
              }}
            >
              <option value="">
                {isStudentBatch
                  ? t('financial.licenses.filter_license_type_required')
                  : t('financial.licenses.filter_license_type_all')}
              </option>
              {licenseTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </div>
          {isStudentBatch ? (
            <div className="space-y-2">
              <Label htmlFor="wizard-discipline">{t('financial.licenses.filter_discipline')}</Label>
              <Select
                id="wizard-discipline"
                value={disciplineId}
                onChange={(event) => {
                  setDisciplineId(event.target.value);
                  setHolders(null);
                  setSelectedIds([]);
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
          ) : null}
          {isStudentBatch ? (
            <div className="space-y-2">
              <Label htmlFor="wizard-age-bracket">{t('financial.licenses.filter_age_bracket')}</Label>
              <Select
                id="wizard-age-bracket"
                value={ageBracket}
                onChange={(event) => {
                  setAgeBracket(event.target.value);
                  setHolders(null);
                  setSelectedIds([]);
                }}
              >
                <option value="">{t('financial.licenses.filter_age_all')}</option>
                {AGE_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>
                    {t(group.labelKey)}
                  </option>
                ))}
                <option value={AGE_CUSTOM}>{t('financial.licenses.filter_age_custom')}</option>
              </Select>
            </div>
          ) : null}
          {isStudentBatch && ageBracket === AGE_CUSTOM ? (
            <>
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-muted-foreground">{t('financial.licenses.filter_born_between')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wizard-year-from">{t('financial.licenses.filter_birth_year_from')}</Label>
                <Input
                  id="wizard-year-from"
                  type="number"
                  min={1900}
                  max={2100}
                  value={birthYearFrom}
                  onChange={(event) => {
                    setBirthYearFrom(event.target.value);
                    setHolders(null);
                    setSelectedIds([]);
                  }}
                  placeholder={t('financial.licenses.filter_birth_year_optional')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wizard-year-to">{t('financial.licenses.filter_birth_year_to')}</Label>
                <Input
                  id="wizard-year-to"
                  type="number"
                  min={1900}
                  max={2100}
                  value={birthYearTo}
                  onChange={(event) => {
                    setBirthYearTo(event.target.value);
                    setHolders(null);
                    setSelectedIds([]);
                  }}
                  placeholder={t('financial.licenses.filter_birth_year_optional')}
                />
              </div>
            </>
          ) : null}
        </FormGrid>
        {isStudentBatch ? (
          <div className="rounded-md border border-border bg-muted/20">
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-foreground"
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen((open) => !open)}
            >
              {t('financial.licenses.advanced_filters')}
              <span className="text-xs font-normal text-muted-foreground">
                {advancedOpen ? t('financial.licenses.advanced_hide') : t('financial.licenses.advanced_show')}
              </span>
            </button>
            {advancedOpen ? (
              <div className="space-y-4 border-t border-border px-3 py-3">
                <FormGrid>
                  <div className="space-y-2">
                    <MultiSelectFilter
                      label={t('financial.licenses.filter_status')}
                      emptyLabel={t('financial.licenses.filter_status_default')}
                      selected={statuses}
                      onChange={(next) => {
                        setStatuses(next.length > 0 ? next : ['ACTIVE']);
                        setHolders(null);
                        setSelectedIds([]);
                      }}
                      options={WIZARD_STATUSES.map((status) => ({
                        value: status,
                        label: t(`enums.status.${status}`),
                      }))}
                    />
                    <p className="text-xs text-muted-foreground">{t('financial.licenses.filter_status_help')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-enrolled">{t('financial.licenses.filter_enrolled_before')}</Label>
                    <DateInput
                      id="wizard-enrolled"
                      value={enrollmentDateBefore}
                      onChange={(event) => {
                        setEnrollmentDateBefore(event.target.value);
                        setHolders(null);
                        setSelectedIds([]);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">{t('financial.licenses.filter_enrolled_before_help')}</p>
                  </div>
                </FormGrid>
              </div>
            ) : null}
          </div>
        ) : null}
        {!isStudentBatch ? (
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
        ) : null}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="button" variant="outline" disabled={!filters || preview.isPending} onClick={onPreview}>
            {preview.isPending ? t('financial.licenses.previewing') : t('financial.licenses.preview')}
          </Button>
          <Button type="button" disabled={generateDisabled} onClick={onGenerate}>
            {isIssuing ? t('financial.licenses.generating') : t('financial.licenses.generate')}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('financial.licenses.sale_hint', { amount: amountCharged })}
        </p>
        {isStudentBatch && holders !== null ? (
          <p className="text-xs text-muted-foreground">
            {t('financial.licenses.selected_count', { count: selectedIds.length })}
          </p>
        ) : null}
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
                    {isStudentBatch ? (
                      <th className="w-10 py-2 pr-3 font-medium">
                        <Checkbox
                          aria-label={t('financial.licenses.select_all')}
                          checked={allSelectableChecked}
                          disabled={selectable.length === 0}
                          onChange={(event) => onToggleAll(event.target.checked)}
                        />
                      </th>
                    ) : null}
                    <th className="py-2 pr-4 font-medium">{t('financial.licenses.table_holder')}</th>
                    <th className="py-2 pr-4 font-medium">{t('financial.licenses.filter_age')}</th>
                    <th className="py-2 pr-4 font-medium">{t('financial.licenses.filter_license_type')}</th>
                    <th className="py-2 font-medium">{t('financial.licenses.table_status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.map((holder) => {
                    const profileId = holder.studentProfileId;
                    const selectableRow = isStudentBatch && isSelectableStudent(holder);
                    return (
                      <tr key={profileId ?? holder.holderUserId} className="border-b border-border last:border-0">
                        {isStudentBatch ? (
                          <td className="py-2 pr-3">
                            <Checkbox
                              aria-label={t('financial.licenses.table_select')}
                              checked={Boolean(profileId && selectedSet.has(profileId))}
                              disabled={!selectableRow}
                              onChange={(event) => {
                                if (profileId) {
                                  onToggleStudent(profileId, event.target.checked);
                                }
                              }}
                            />
                          </td>
                        ) : null}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </FormSection>
      ) : null}

      <BatchResultModal result={batchResult} holders={holders ?? []} onClose={() => setBatchResult(null)} />
    </div>
  );
}
