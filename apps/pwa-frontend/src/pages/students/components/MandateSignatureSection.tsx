/**
 * @file MandateSignatureSection.tsx
 * @description Student banking profile: SEPA signature badge and entry point to clickwrap signing.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useFinancialConfig } from '@/pages/financial/useFinancialConfig';
import { useStudentMandate } from '../useStudentMandate';
import { MandateStatusBadge } from './MandateStatusBadge';
import { SepaSignModal } from './SepaSignModal';

interface MandateSignatureSectionProps {
  bankMandateId?: string | null;
  payerUserId?: string | null;
}

/**
 * Loads the payer's mandate and shows pending/signed status with a digital-sign action when unsigned.
 *
 * @param {MandateSignatureSectionProps} props - Mandate id and/or payer User id.
 * @returns {JSX.Element | null} Signature status block, or `null` when no mandate exists.
 */
export function MandateSignatureSection({ bankMandateId, payerUserId }: MandateSignatureSectionProps) {
  const { t } = useTranslation();
  const { mandate, isLoading, signMandate } = useStudentMandate({ mandateId: bankMandateId, payerUserId });
  const { config } = useFinancialConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading || !mandate) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{t('students.sepa.status_title')}</p>
          <MandateStatusBadge mandate={mandate} />
        </div>
        {!mandate.isSigned ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              signMandate.reset();
              setIsModalOpen(true);
            }}
          >
            {t('students.sepa.open_sign')}
          </Button>
        ) : null}
      </div>

      <SepaSignModal
        isOpen={isModalOpen}
        mandate={mandate}
        legalName={config?.legalName ?? ''}
        creditorId={config?.creditorId ?? ''}
        isPending={signMandate.isPending}
        error={signMandate.error}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(mandateId) => {
          signMandate.mutate(mandateId, {
            onSuccess: () => setIsModalOpen(false),
          });
        }}
      />
    </div>
  );
}
