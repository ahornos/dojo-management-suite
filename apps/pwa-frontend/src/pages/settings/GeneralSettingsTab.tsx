/**
 * @file GeneralSettingsTab.tsx
 * @description Tenant identity form (legal name, trade name, tax id, timezone, currency).
 */

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/forms/CountrySelector';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useFinancialConfig } from '@/pages/financial/useFinancialConfig';
import { academyGeneralSchema, type AcademyGeneralValues } from './schema';
import { SettingsFeedback } from './SettingsFeedback';
import type { AcademySettings } from './types';
import { useAcademySettings } from './useAcademySettings';

const TIMEZONES = ['Europe/Madrid', 'Atlantic/Canary', 'Europe/Lisbon', 'Europe/Paris', 'Europe/London', 'UTC'] as const;

const EMPTY_GENERAL: AcademyGeneralValues = {
  legalName: '',
  tradeName: '',
  taxId: '',
  officialEmail: '',
  timezone: 'Europe/Madrid',
  defaultCurrency: 'EUR',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'ES',
};

/**
 * Maps a persisted settings row onto the general form.
 *
 * @param {AcademySettings} data - API payload.
 * @returns {AcademyGeneralValues} Form defaults.
 */
function toGeneralValues(data: AcademySettings): AcademyGeneralValues {
  return {
    legalName: data.legalName,
    tradeName: data.tradeName || data.brandName || data.displayName,
    taxId: data.taxId,
    officialEmail: data.officialEmail,
    timezone: data.timezone || 'Europe/Madrid',
    defaultCurrency: data.defaultCurrency || 'EUR',
    phone: data.phone,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    country: data.country || 'ES',
  };
}

/**
 * Tenant identity tab. Dual-writes legal name / tax id / address to financial-service for remittances.
 *
 * @returns {JSX.Element} General settings form.
 */
export function GeneralSettingsTab(): JSX.Element {
  const { t } = useTranslation();
  const settings = useAcademySettings();
  const financial = useFinancialConfig();
  const schema = useMemo(() => academyGeneralSchema(), []);
  const form = useForm<AcademyGeneralValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_GENERAL,
  });

  useEffect(() => {
    if (!settings.data) return;
    form.reset(toGeneralValues(settings.data));
  }, [settings.data, form]);

  /**
   * Persists academy identity and mirrors legal fields into TenantFinancialConfig.
   *
   * @param {AcademyGeneralValues} values - Validated identity.
   * @returns {void}
   */
  const onSubmit = (values: AcademyGeneralValues) => {
    settings.save.mutate(values, {
      onSuccess: () => {
        if (!financial.config) return;
        financial.save.mutate({
          legalName: values.legalName,
          taxId: values.taxId,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          country: values.country || 'ES',
          creditorId: financial.config.creditorId,
          iban: financial.config.iban,
          bic: financial.config.bic ?? '',
        });
      },
    });
  };

  return (
    <FormSection title={t('settings.general_title')} description={t('settings.general_help')}>
      {settings.isLoading ? <p className="text-sm text-muted-foreground">{t('settings.loading')}</p> : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SettingsFeedback
            error={settings.error ?? settings.save.error}
            success={settings.save.isSuccess}
            fallback="settings.save_error"
          />
          <FormGrid>
            <TextField name="legalName" label={t('settings.legal_name')} required />
            <TextField name="tradeName" label={t('settings.trade_name')} required />
            <TextField name="taxId" label={t('settings.tax_id')} required />
            <TextField name="officialEmail" label={t('settings.official_email')} type="email" required />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.timezone')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                      {TIMEZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {t(`settings.timezone_${zone.replace('/', '_')}`)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.currency')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                      <option value="EUR">{t('settings.currency_EUR')}</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextField name="phone" label={t('settings.phone')} />
            <TextField name="address" label={t('settings.address')} className="md:col-span-2" />
            <TextField name="city" label={t('settings.city')} />
            <TextField name="postalCode" label={t('settings.postal_code')} />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.country')}</FormLabel>
                  <FormControl>
                    <CountrySelector value={field.value} onChange={(event) => field.onChange(event.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          <Button type="submit" disabled={settings.save.isPending}>
            {settings.save.isPending ? t('settings.saving') : t('settings.save')}
          </Button>
        </form>
      </Form>
    </FormSection>
  );
}

/**
 * react-hook-form text field bound to the nearest form context.
 *
 * @param {object} props - Field name and label.
 * @returns {JSX.Element} Input field.
 */
function TextField({
  name,
  label,
  type = 'text',
  className,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  className?: string;
  required?: boolean;
}): JSX.Element {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className ? `space-y-2 ${className}` : 'space-y-2'}>
          <FormLabel>
            {label}
            {required ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
