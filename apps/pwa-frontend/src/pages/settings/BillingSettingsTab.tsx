/**
 * @file BillingSettingsTab.tsx
 * @description SEPA creditor configuration owned by financial-service (decoupled from academic data).
 */

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFinancialConfig } from '@/pages/financial/useFinancialConfig';
import { academyBillingSchema, type AcademyBillingValues } from './schema';
import { SettingsFeedback } from './SettingsFeedback';

const EMPTY_BILLING: AcademyBillingValues = {
  creditorId: '',
  iban: '',
  bic: '',
};

/**
 * Facturación tab: academy IBAN and SEPA creditor id. Ready for a future `stripeAccountId`.
 *
 * @returns {JSX.Element} Billing form.
 */
export function BillingSettingsTab(): JSX.Element {
  const { t } = useTranslation();
  const { config, isLoading, error, save } = useFinancialConfig();
  const schema = useMemo(() => academyBillingSchema(), []);
  const form = useForm<AcademyBillingValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_BILLING,
  });

  useEffect(() => {
    if (!config) return;
    form.reset({
      creditorId: config.creditorId,
      iban: config.iban,
      bic: config.bic ?? '',
    });
  }, [config, form]);

  /**
   * Persists only SEPA fields so academic identity is not overwritten.
   *
   * @param {AcademyBillingValues} values - Creditor banking.
   * @returns {void}
   */
  const onSubmit = (values: AcademyBillingValues) => {
    save.mutate({
      legalName: config?.legalName ?? '',
      taxId: config?.taxId ?? '',
      address: config?.address ?? '',
      city: config?.city ?? '',
      postalCode: config?.postalCode ?? '',
      country: config?.country || 'ES',
      creditorId: values.creditorId,
      iban: values.iban,
      bic: values.bic,
    });
  };

  return (
    <FormSection title={t('settings.billing_title')} description={t('settings.billing_help')}>
      {isLoading ? <p className="text-sm text-muted-foreground">{t('settings.loading')}</p> : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SettingsFeedback error={error ?? save.error} success={save.isSuccess} fallback="financial.config.save_error" />
          <FormGrid>
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem className="space-y-2 md:col-span-2">
                  <FormLabel>{t('settings.iban')}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" placeholder={t('financial.config.iban_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditorId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.creditor_id')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('financial.config.creditor_id_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bic"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.bic')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('financial.config.bic_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? t('settings.saving') : t('settings.save')}
          </Button>
        </form>
      </Form>
    </FormSection>
  );
}
