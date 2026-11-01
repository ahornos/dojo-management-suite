/**
 * @file FinancialConfig.tsx
 * @description Staff form for the academy's legal and SEPA creditor identity (pain.008 / invoices).
 */

import { useEffect, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/forms/CountrySelector';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { translateApiError } from '@/lib/errors';
import { financialConfigSchema, type FinancialConfigFormValues } from './schema';
import { useFinancialConfig } from './useFinancialConfig';

const EMPTY_FORM: FinancialConfigFormValues = {
  legalName: '',
  taxId: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'ES',
  creditorId: '',
  iban: '',
  bic: '',
};

/**
 * Financial configuration page: fetch the tenant row, edit, and save.
 *
 * @returns {JSX.Element} The configuration workspace.
 */
export default function FinancialConfig() {
  const { t } = useTranslation();
  const { config, isLoading, error, save } = useFinancialConfig();

  const schema = useMemo(() => financialConfigSchema(), []);
  const form = useForm<FinancialConfigFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (!config) return;
    form.reset({
      legalName: config.legalName,
      taxId: config.taxId,
      address: config.address,
      city: config.city,
      postalCode: config.postalCode,
      country: config.country || 'ES',
      creditorId: config.creditorId,
      iban: config.iban,
      bic: config.bic ?? '',
    });
  }, [config, form]);

  /**
   * Persists the form through PUT `/financial/config`.
   *
   * @param {FinancialConfigFormValues} values - Validated form values.
   * @returns {void}
   */
  const onSubmit = (values: FinancialConfigFormValues) => {
    save.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{t('financial.config.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('financial.config.subtitle')}</p>
      </div>

      <Card className="max-w-4xl border-border">
        <CardHeader className="border-b border-border bg-muted pb-4">
          <CardTitle className="text-xl text-foreground">{t('financial.config.form_title')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t('financial.config.loading')}</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {translateApiError(t, error, 'financial.config.load_error')}
                  </p>
                ) : null}
                {save.error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {translateApiError(t, save.error, 'financial.config.save_error')}
                  </p>
                ) : null}
                {save.isSuccess ? (
                  <p className="rounded-md border border-border bg-muted p-3 text-sm text-foreground" role="status">
                    {t('financial.config.saved')}
                  </p>
                ) : null}

                <FormSection
                  title={t('financial.config.legal_section')}
                  description={t('financial.config.legal_section_help')}
                >
                  <FormGrid>
                    <ConfigField name="legalName" labelKey="legal_name" placeholderKey="legal_name_placeholder" />
                    <ConfigField name="taxId" labelKey="tax_id" placeholderKey="tax_id_placeholder" />
                    <ConfigField
                      name="address"
                      labelKey="address"
                      placeholderKey="address_placeholder"
                      className="md:col-span-2"
                    />
                    <ConfigField name="city" labelKey="city" placeholderKey="city_placeholder" />
                    <ConfigField name="postalCode" labelKey="postal_code" placeholderKey="postal_code_placeholder" />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-foreground">
                            {t('financial.config.country')}
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
                              {t(`financial.config.${fieldState.error.message}`)}
                            </p>
                          ) : (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />
                  </FormGrid>
                </FormSection>

                <FormSection
                  title={t('financial.config.sepa_section')}
                  description={t('financial.config.sepa_section_help')}
                >
                  <FormGrid>
                    <ConfigField name="creditorId" labelKey="creditor_id" placeholderKey="creditor_id_placeholder" />
                    <ConfigField name="iban" labelKey="iban" placeholderKey="iban_placeholder" className="md:col-span-2" />
                    <ConfigField name="bic" labelKey="bic" placeholderKey="bic_placeholder" />
                  </FormGrid>
                </FormSection>

                <div className="flex justify-end border-t border-border pt-4">
                  <Button type="submit" disabled={save.isPending || isLoading}>
                    {save.isPending ? t('financial.config.saving') : t('financial.config.save')}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ConfigFieldProps {
  name: keyof FinancialConfigFormValues;
  labelKey: string;
  placeholderKey: string;
  className?: string;
}

/**
 * Single labelled input bound to the financial config form.
 *
 * @param {ConfigFieldProps} props - Field name, i18n key suffixes, and optional grid span.
 * @returns {JSX.Element} Form field.
 */
function ConfigField({ name, labelKey, placeholderKey, className }: ConfigFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<FinancialConfigFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormLabel className="text-sm font-medium text-foreground">
            {t(`financial.config.${labelKey}`)}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={t(`financial.config.${placeholderKey}`)}
              autoComplete="off"
              spellCheck={false}
            />
          </FormControl>
          {fieldState.error?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {t(`financial.config.${fieldState.error.message}`)}
            </p>
          ) : (
            <FormMessage />
          )}
        </FormItem>
      )}
    />
  );
}
