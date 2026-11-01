/**
 * @file BankingDetailsSection.tsx
 * @description SEPA banking fields plus clickwrap acceptance for student create/edit forms.
 */

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toIban, type BankingDetails } from '../banking';

interface BankingDetailsSectionProps {
  values: BankingDetails;
  sepaAccepted: boolean;
  errors: Record<string, string>;
  required: boolean;
  onChange: (field: keyof BankingDetails, value: string) => void;
  onAcceptChange: (accepted: boolean) => void;
  children?: ReactNode;
}

/**
 * Billing & SEPA block: holder name, DNI, IBAN, and explicit clickwrap checkbox.
 *
 * @param {BankingDetailsSectionProps} props - Values, consent, errors, and optional signature status.
 * @returns {JSX.Element} Section.
 */
export function BankingDetailsSection({
  values,
  sepaAccepted,
  errors,
  required,
  onChange,
  onAcceptChange,
  children,
}: BankingDetailsSectionProps) {
  const { t } = useTranslation();
  const holderError = errors.accountHolderName
    ? t(`students.form.${errors.accountHolderName}`)
    : undefined;
  const dniError = errors.accountHolderDni
    ? t(`students.form.${errors.accountHolderDni}`)
    : undefined;
  const ibanError = errors.iban ? t(`students.form.${errors.iban}`) : undefined;
  const acceptError = errors.sepaAccepted
    ? t(`students.form.${errors.sepaAccepted}`)
    : undefined;

  return (
    <FormSection
      title={t('students.form.banking_title')}
      description={required ? t('students.form.banking_help') : t('students.form.banking_help_optional')}
    >
      <FormGrid>
        <Field
          id="accountHolderName"
          label={t('students.form.account_holder_name')}
          required={required}
          error={holderError}
        >
          <Input
            id="accountHolderName"
            value={values.accountHolderName}
            onChange={(event) => onChange('accountHolderName', event.target.value)}
            placeholder={t('students.form.account_holder_placeholder')}
            aria-invalid={Boolean(holderError)}
          />
        </Field>
        <Field
          id="accountHolderDni"
          label={t('students.form.account_holder_dni')}
          required={required}
          error={dniError}
        >
          <Input
            id="accountHolderDni"
            value={values.accountHolderDni}
            onChange={(event) => onChange('accountHolderDni', event.target.value)}
            placeholder={t('students.form.account_holder_dni_placeholder')}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(dniError)}
          />
        </Field>
        <Field
          id="iban"
          label={t('students.form.iban')}
          required={required}
          className="md:col-span-2"
          error={ibanError}
        >
          <Input
            id="iban"
            value={values.iban}
            onChange={(event) => onChange('iban', event.target.value)}
            onBlur={() => onChange('iban', toIban(values.iban))}
            placeholder={t('students.form.iban_placeholder')}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(ibanError)}
          />
        </Field>
        <div className="md:col-span-2 space-y-2 rounded-md border border-border bg-muted p-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <Checkbox
              id="sepaAccepted"
              checked={sepaAccepted}
              onChange={(event) => onAcceptChange(event.target.checked)}
              aria-invalid={Boolean(acceptError)}
            />
            <span>{t('students.sepa.checkbox')}</span>
          </label>
          {acceptError ? (
            <p className="text-sm text-destructive" role="alert">
              {acceptError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{t('students.form.sepa_accept_help')}</p>
          )}
        </div>
      </FormGrid>
      {children ? <div className="mt-4">{children}</div> : null}
    </FormSection>
  );
}
