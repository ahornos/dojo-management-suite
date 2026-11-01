/**
 * @file FederationForm.tsx
 * @description Two-step federation wizard: identity/contacts, then seasons and pricing matrices.
 */

import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/forms/CountrySelector';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DEFAULT_COUNTRY } from '@/lib/countries';
import { FEDERATION_CONTACT_MEDIA, FEDERATION_CURRENCIES } from '@/lib/domain-enums';
import { cn } from '@/lib/utils';
import { MoneyInput } from './MoneyInput';
import { federationSchema, type FederationFormValues } from './schema';
import type { Federation } from './types';

const EMPTY_CONTACT: FederationFormValues['contacts'][number] = {
  medium: 'EMAIL',
  tag: '',
  value: '',
};

/**
 * @param {string} [label] - Optional custom-row label.
 * @returns {FederationFormValues['seasons'][number]['licenseTypes'][number]['priceRows'][number]} Blank CUSTOM row.
 */
function emptyCustomRow(label = ''): FederationFormValues['seasons'][number]['licenseTypes'][number]['priceRows'][number] {
  return {
    kind: 'CUSTOM',
    label,
    birthYearFrom: '',
    cost: '',
    reduction: '0.00',
    chargePrice: '',
  };
}

/**
 * @returns {FederationFormValues['seasons'][number]['licenseTypes'][number]} Default license type with instructor/adult/youth rows.
 */
function emptyLicenseType(): FederationFormValues['seasons'][number]['licenseTypes'][number] {
  return {
    name: '',
    priceRows: [
      { kind: 'INSTRUCTOR', label: '', birthYearFrom: '', cost: '', reduction: '0.00', chargePrice: '' },
      { kind: 'ADULT', label: '', birthYearFrom: '', cost: '', reduction: '0.00', chargePrice: '' },
      emptyCustomRow('Infantil/Juvenil'),
    ],
  };
}

/**
 * @returns {FederationFormValues['seasons'][number]} Blank season.
 */
function emptySeason(): FederationFormValues['seasons'][number] {
  return {
    seasonName: '',
    currency: 'EUR',
    clubCost: '',
    licenseTypes: [emptyLicenseType()],
  };
}

const EMPTY_FORM: FederationFormValues = {
  name: '',
  acronym: '',
  country: DEFAULT_COUNTRY,
  email: '',
  contacts: [{ ...EMPTY_CONTACT }],
  seasons: [emptySeason()],
};

interface FederationFormProps {
  federation?: Federation | null;
  onSubmit: (values: FederationFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

/**
 * Federation identity + seasonal pricing wizard used by `/federations/new` and `:id/edit`.
 *
 * @param {FederationFormProps} props - Optional existing row, submit/cancel, pending flag.
 * @returns {JSX.Element} Form card.
 */
export function FederationForm({ federation, onSubmit, onCancel, isPending }: FederationFormProps): JSX.Element {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const schema = useMemo(() => federationSchema(), []);
  const form = useForm<FederationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
  });
  const contacts = useFieldArray({ control: form.control, name: 'contacts' });
  const seasons = useFieldArray({ control: form.control, name: 'seasons' });

  useEffect(() => {
    if (!federation) {
      form.reset(EMPTY_FORM);
      setStep(1);
      return;
    }
    form.reset({
      name: federation.name,
      acronym: federation.acronym ?? '',
      country: federation.country || DEFAULT_COUNTRY,
      email: federation.email ?? '',
      contacts:
        federation.contacts && federation.contacts.length > 0
          ? federation.contacts.map((contact) => ({
              medium: contact.medium,
              tag: contact.tag,
              value: contact.value,
            }))
          : [{ ...EMPTY_CONTACT }],
      seasons:
        federation.seasons && federation.seasons.length > 0
          ? federation.seasons.map((season) => ({
              id: season.id,
              seasonName: season.seasonName,
              currency: (FEDERATION_CURRENCIES as readonly string[]).includes(season.currency)
                ? (season.currency as FederationFormValues['seasons'][number]['currency'])
                : 'EUR',
              clubCost: season.clubCost,
              licenseTypes:
                season.licenseTypes.length > 0
                  ? season.licenseTypes.map((type) => ({
                      id: type.id,
                      name: type.name,
                      priceRows: hydratePriceRows(type.priceRows),
                    }))
                  : [emptyLicenseType()],
            }))
          : [emptySeason()],
    });
    setStep(1);
  }, [federation, form]);

  /**
   * Validates identity fields before opening the pricing step.
   *
   * @returns {Promise<void>}
   */
  const goToPricing = async (): Promise<void> => {
    const valid = await form.trigger(['name', 'acronym', 'country', 'email', 'contacts']);
    if (valid) {
      setStep(2);
    }
  };

  return (
    <Card className="w-full border-border shadow-md">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-border pb-4">
              <Button type="button" variant={step === 1 ? 'default' : 'outline'} size="sm" onClick={() => setStep(1)}>
                {t('financial.federations.step_identity')}
              </Button>
              <Button type="button" variant={step === 2 ? 'default' : 'outline'} size="sm" onClick={() => void goToPricing()}>
                {t('financial.federations.step_seasons')}
              </Button>
            </div>

            {step === 1 ? (
              <>
                <FormSection title={t('financial.federations.profile_section')}>
                  <FormGrid>
                    <TextField name="name" labelKey="name" className="md:col-span-2" />
                    <TextField name="acronym" labelKey="acronym" />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-foreground">
                            {t('financial.federations.country')}
                          </FormLabel>
                          <FormControl>
                            <CountrySelector
                              value={field.value}
                              onChange={(event) => field.onChange(event.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          {fieldState.error?.message ? (
                            <p className="text-sm text-destructive" role="alert">
                              {t(`financial.federations.${fieldState.error.message}`)}
                            </p>
                          ) : (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />
                    <TextField name="email" labelKey="email" type="email" />
                  </FormGrid>
                </FormSection>

                <FormSection
                  title={t('financial.federations.contacts_section')}
                  description={t('financial.federations.contacts_section_help')}
                >
                  <div className="space-y-4">
                    {contacts.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid gap-3 rounded-md border border-border bg-muted/30 p-3 md:grid-cols-12"
                      >
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.medium`}
                          render={({ field: mediumField }) => (
                            <FormItem className="md:col-span-3">
                              <FormLabel className="text-sm font-medium text-foreground">
                                {t('financial.federations.contact_medium')}
                              </FormLabel>
                              <FormControl>
                                <Select {...mediumField}>
                                  {FEDERATION_CONTACT_MEDIA.map((medium) => (
                                    <option key={medium} value={medium}>
                                      {t(`enums.federation_contact_medium.${medium}`)}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <TextField name={`contacts.${index}.tag`} labelKey="contact_tag" className="md:col-span-3" />
                        <TextField name={`contacts.${index}.value`} labelKey="contact_value" className="md:col-span-4" />
                        <div className="flex items-end md:col-span-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => contacts.remove(index)}
                            disabled={contacts.fields.length === 1}
                          >
                            {t('financial.federations.remove_contact')}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => contacts.append({ ...EMPTY_CONTACT })}>
                      {t('financial.federations.add_contact')}
                    </Button>
                  </div>
                </FormSection>
              </>
            ) : (
              <FormSection
                title={t('financial.federations.seasons_section')}
                description={t('financial.federations.seasons_section_help')}
              >
                <div className="space-y-6">
                  {seasons.fields.map((field, index) => (
                    <SeasonCard
                      key={field.id}
                      index={index}
                      canRemove={seasons.fields.length > 1}
                      onRemove={() => seasons.remove(index)}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => seasons.append(emptySeason())}>
                    {t('financial.federations.add_season')}
                  </Button>
                </div>
              </FormSection>
            )}

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              {step === 2 ? (
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isPending}>
                  {t('financial.federations.back')}
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                  {t('financial.federations.cancel')}
                </Button>
              )}
              {step === 1 ? (
                <Button type="button" onClick={() => void goToPricing()}>
                  {t('financial.federations.next')}
                </Button>
              ) : (
                <Button type="submit" disabled={isPending}>
                  {isPending ? t('financial.federations.saving') : t('financial.federations.save')}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface SeasonCardProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

/**
 * One season block: name, currency, club cost, and license-type matrices.
 *
 * @param {SeasonCardProps} props - Season index and remove handler.
 * @returns {JSX.Element} Season editor.
 */
function SeasonCard({ index, canRemove, onRemove }: SeasonCardProps): JSX.Element {
  const { t } = useTranslation();
  const form = useFormContext<FederationFormValues>();
  const licenseTypes = useFieldArray({ name: `seasons.${index}.licenseTypes` });
  const currency = useWatch({ control: form.control, name: `seasons.${index}.currency` });

  return (
    <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
      <FormGrid>
        <TextField name={`seasons.${index}.seasonName`} labelKey="season_name" />
        <FormField
          name={`seasons.${index}.currency`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                {t('financial.federations.currency')}
              </FormLabel>
              <FormControl>
                <Select {...field}>
                  {FEDERATION_CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {t(`currencies.${code}`)}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <MoneyField name={`seasons.${index}.clubCost`} labelKey="club_cost" currency={currency} />
      </FormGrid>

      {licenseTypes.fields.map((field, typeIndex) => (
        <LicenseTypeCard
          key={field.id}
          seasonIndex={index}
          typeIndex={typeIndex}
          canRemove={licenseTypes.fields.length > 1}
          onRemove={() => licenseTypes.remove(typeIndex)}
        />
      ))}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => licenseTypes.append(emptyLicenseType())}>
          {t('financial.federations.add_license_type')}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onRemove} disabled={!canRemove}>
          {t('financial.federations.remove_season')}
        </Button>
      </div>
    </div>
  );
}

interface LicenseTypeCardProps {
  seasonIndex: number;
  typeIndex: number;
  canRemove: boolean;
  onRemove: () => void;
}

/**
 * License type name plus the instructor/adult/custom pricing table.
 *
 * @param {LicenseTypeCardProps} props - Indexes and remove handler.
 * @returns {JSX.Element} License type editor.
 */
function LicenseTypeCard({ seasonIndex, typeIndex, canRemove, onRemove }: LicenseTypeCardProps): JSX.Element {
  const { t } = useTranslation();
  const priceRows = useFieldArray({ name: `seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows` });

  return (
    <div className="space-y-3 rounded-md border border-border bg-background p-3">
      <FormGrid>
        <TextField
          name={`seasons.${seasonIndex}.licenseTypes.${typeIndex}.name`}
          labelKey="license_type_name"
          className="md:col-span-2"
        />
      </FormGrid>
      <PricingMatrixTable seasonIndex={seasonIndex} typeIndex={typeIndex} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => priceRows.append(emptyCustomRow())}>
          {t('financial.federations.add_price_row')}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onRemove} disabled={!canRemove}>
          {t('financial.federations.remove_license_type')}
        </Button>
      </div>
    </div>
  );
}

interface PricingMatrixTableProps {
  seasonIndex: number;
  typeIndex: number;
}

/**
 * Pricing matrix: holder/range, cost, reduction, computed net, charge price.
 *
 * @param {PricingMatrixTableProps} props - Season and type indexes.
 * @returns {JSX.Element} Table.
 */
function PricingMatrixTable({ seasonIndex, typeIndex }: PricingMatrixTableProps): JSX.Element {
  const { t } = useTranslation();
  const form = useFormContext<FederationFormValues>();
  const currency = useWatch({ control: form.control, name: `seasons.${seasonIndex}.currency` });
  const rows = useWatch({
    control: form.control,
    name: `seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows`,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="py-2 pr-3 font-medium">{t('financial.federations.price_col_range')}</th>
            <th className="py-2 pr-3 font-medium">{t('financial.federations.price_col_cost')}</th>
            <th className="py-2 pr-3 font-medium">{t('financial.federations.price_col_reduction')}</th>
            <th className="py-2 pr-3 font-medium">{t('financial.federations.price_col_net')}</th>
            <th className="py-2 font-medium">{t('financial.federations.price_col_charge')}</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((row, rowIndex) => (
            <tr key={`${row.kind}-${rowIndex}`} className="border-b border-border last:border-0 align-top">
              <td className="py-2 pr-3">
                {row.kind === 'CUSTOM' ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <MatrixInput
                      name={`seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows.${rowIndex}.label`}
                      ariaLabel={t('financial.federations.price_row_label')}
                    />
                    <MatrixInput
                      name={`seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows.${rowIndex}.birthYearFrom`}
                      ariaLabel={t('financial.federations.birth_year_from')}
                      placeholder={t('financial.federations.birth_year_placeholder')}
                    />
                  </div>
                ) : (
                  <span className="font-medium text-foreground">
                    {t(`financial.federations.price_kind_${row.kind.toLowerCase()}`)}
                  </span>
                )}
              </td>
              <td className="py-2 pr-3">
                <MatrixInput
                  name={`seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows.${rowIndex}.cost`}
                  currency={currency}
                />
              </td>
              <td className="py-2 pr-3">
                <MatrixInput
                  name={`seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows.${rowIndex}.reduction`}
                  currency={currency}
                />
              </td>
              <td className="py-2 pr-3 text-foreground">{formatNet(row?.cost, row?.reduction)}</td>
              <td className="py-2">
                <MatrixInput
                  name={`seasons.${seasonIndex}.licenseTypes.${typeIndex}.priceRows.${rowIndex}.chargePrice`}
                  currency={currency}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TextFieldProps {
  name: Parameters<ReturnType<typeof useFormContext<FederationFormValues>>['register']>[0];
  labelKey: string;
  className?: string;
  type?: string;
}

/**
 * Labelled input bound to the federation form.
 *
 * @param {TextFieldProps} props - Field path and i18n suffix.
 * @returns {JSX.Element} Form field.
 */
function TextField({ name, labelKey, className, type = 'text' }: TextFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<FederationFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormLabel className="text-sm font-medium text-foreground">
            {t(`financial.federations.${labelKey}`)}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              value={typeof field.value === 'string' ? field.value : ''}
              autoComplete="off"
              spellCheck={false}
            />
          </FormControl>
          {fieldState.error?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {t(`financial.federations.${fieldState.error.message}`)}
            </p>
          ) : (
            <FormMessage />
          )}
        </FormItem>
      )}
    />
  );
}

interface MoneyFieldProps {
  name: Parameters<ReturnType<typeof useFormContext<FederationFormValues>>['register']>[0];
  labelKey: string;
  currency?: string;
  className?: string;
}

/**
 * Labelled monetary input with a currency suffix addon.
 *
 * @param {MoneyFieldProps} props - Field path, i18n suffix, and season currency.
 * @returns {JSX.Element} Form field.
 */
function MoneyField({ name, labelKey, currency, className }: MoneyFieldProps): JSX.Element {
  const { t } = useTranslation();
  const form = useFormContext<FederationFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormLabel className="text-sm font-medium text-foreground">
            {t(`financial.federations.${labelKey}`)}
          </FormLabel>
          <FormControl>
            <MoneyInput
              {...field}
              currency={currency}
              value={typeof field.value === 'string' ? field.value : ''}
            />
          </FormControl>
          {fieldState.error?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {t(`financial.federations.${fieldState.error.message}`)}
            </p>
          ) : (
            <FormMessage />
          )}
        </FormItem>
      )}
    />
  );
}

interface MatrixInputProps {
  name: Parameters<ReturnType<typeof useFormContext<FederationFormValues>>['register']>[0];
  ariaLabel?: string;
  placeholder?: string;
  currency?: string;
}

/**
 * Compact money/label input used inside the pricing table.
 *
 * @param {MatrixInputProps} props - Field path and optional currency suffix.
 * @returns {JSX.Element} Input.
 */
function MatrixInput({ name, ariaLabel, placeholder, currency }: MatrixInputProps): JSX.Element {
  const { t } = useTranslation();
  const form = useFormContext<FederationFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const value = typeof field.value === 'string' ? field.value : '';
        return (
          <FormItem className="space-y-1">
            <FormControl>
              {currency ? (
                <MoneyInput
                  {...field}
                  aria-label={ariaLabel}
                  placeholder={placeholder}
                  currency={currency}
                  value={value}
                />
              ) : (
                <Input
                  {...field}
                  aria-label={ariaLabel}
                  placeholder={placeholder}
                  value={value}
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </FormControl>
            {fieldState.error?.message ? (
              <p className="text-xs text-destructive" role="alert">
                {t(`financial.federations.${fieldState.error.message}`)}
              </p>
            ) : null}
          </FormItem>
        );
      }}
    />
  );
}

/**
 * Ensures instructor/adult rows exist when hydrating a persisted type.
 *
 * @param {NonNullable<Federation['seasons']>[number]['licenseTypes'][number]['priceRows']} rows - Persisted rows.
 * @returns {FederationFormValues['seasons'][number]['licenseTypes'][number]['priceRows']} Form rows.
 */
function hydratePriceRows(
  rows: NonNullable<Federation['seasons']>[number]['licenseTypes'][number]['priceRows'],
): FederationFormValues['seasons'][number]['licenseTypes'][number]['priceRows'] {
  const mapped = rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    label: row.label,
    birthYearFrom: row.birthYearFrom?.toString() ?? '',
    cost: row.cost,
    reduction: row.reduction,
    chargePrice: row.chargePrice,
  }));
  const hasInstructor = mapped.some((row) => row.kind === 'INSTRUCTOR');
  const hasAdult = mapped.some((row) => row.kind === 'ADULT');
  return [
    ...(hasInstructor
      ? []
      : [{ kind: 'INSTRUCTOR' as const, label: '', birthYearFrom: '', cost: '', reduction: '0.00', chargePrice: '' }]),
    ...(hasAdult
      ? []
      : [{ kind: 'ADULT' as const, label: '', birthYearFrom: '', cost: '', reduction: '0.00', chargePrice: '' }]),
    ...mapped,
  ];
}

/**
 * @param {string | undefined} cost - Cost field.
 * @param {string | undefined} reduction - Reduction field.
 * @returns {string} Display net or em dash.
 */
function formatNet(cost: string | undefined, reduction: string | undefined): string {
  const costValue = Number.parseFloat(cost ?? '');
  const reductionValue = Number.parseFloat(reduction || '0');
  if (Number.isNaN(costValue)) {
    return '—';
  }
  const net = Math.max(0, costValue - (Number.isNaN(reductionValue) ? 0 : reductionValue));
  return net.toFixed(2);
}
