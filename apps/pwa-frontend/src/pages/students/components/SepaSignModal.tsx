/**
 * @file SepaSignModal.tsx
 * @description Clickwrap SEPA Direct Debit mandate: on-screen legal terms, explicit checkbox, digital sign.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { translateApiError } from '@/lib/errors';
import { compactIban } from '@/lib/iban';
import type { BankMandate } from '../types';

interface SepaSignModalProps {
  isOpen: boolean;
  mandate: BankMandate | null;
  legalName: string;
  creditorId: string;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (mandateId: string) => void;
}

/**
 * Groups an IBAN into blocks of four for on-screen legal display.
 *
 * @param {string} iban - Compact or spaced IBAN.
 * @returns {string} Spaced IBAN.
 */
function displayIban(iban: string): string {
  return compactIban(iban).replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Digital SEPA mandate view. Confirm stays disabled until the consent checkbox is ticked.
 *
 * @param {SepaSignModalProps} props - Mandate, academy identity, mutation state, and handlers.
 * @returns {JSX.Element | null} The dialog, or `null` when closed.
 */
export function SepaSignModal({
  isOpen,
  mandate,
  legalName,
  creditorId,
  isPending,
  error,
  onClose,
  onConfirm,
}: SepaSignModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  if (!isOpen || !mandate) {
    return null;
  }

  const interpolation = {
    legalName: legalName.trim() || t('students.sepa.unknown_creditor'),
    creditorId: creditorId.trim() || t('students.sepa.unknown_creditor_id'),
    iban: displayIban(mandate.iban),
    accountHolderName: mandate.accountHolderName,
    mandateReference: mandate.mandateReference,
  };

  /**
   * Closes the dialog and clears the checkbox so the next open starts unsigned.
   *
   * @returns {void}
   */
  const handleClose = (): void => {
    setAccepted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sepa-sign-title"
    >
      <Card className="my-8 w-full max-w-2xl bg-card shadow-xl">
        <CardHeader>
          <CardTitle id="sepa-sign-title" className="text-foreground">
            {t('students.sepa.modal_title')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t('students.sepa.modal_subtitle')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t('students.sepa.creditor')}</dt>
              <dd className="font-medium text-foreground">{interpolation.legalName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('students.sepa.creditor_id')}</dt>
              <dd className="font-medium text-foreground">{interpolation.creditorId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('students.sepa.debtor')}</dt>
              <dd className="font-medium text-foreground">{interpolation.accountHolderName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('students.sepa.iban')}</dt>
              <dd className="font-medium text-foreground">{interpolation.iban}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">{t('students.sepa.reference')}</dt>
              <dd className="font-medium text-foreground">{interpolation.mandateReference}</dd>
            </div>
          </dl>

          <div className="max-h-56 space-y-3 overflow-y-auto rounded-md border border-border bg-muted p-4 text-sm text-foreground">
            <p>{t('students.sepa.legal_p1', interpolation)}</p>
            <p>{t('students.sepa.legal_p2', interpolation)}</p>
            <p>{t('students.sepa.legal_p3')}</p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <Checkbox
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              disabled={isPending}
            />
            <span>{t('students.sepa.checkbox')}</span>
          </label>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {translateApiError(t, error, 'students.sepa.sign_error')}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t('students.sepa.cancel')}
            </Button>
            <Button
              type="button"
              disabled={!accepted || isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onConfirm(mandate.id)}
            >
              {isPending ? t('students.sepa.signing') : t('students.sepa.confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
