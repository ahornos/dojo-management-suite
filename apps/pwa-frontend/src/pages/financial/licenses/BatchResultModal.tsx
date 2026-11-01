/**
 * @file BatchResultModal.tsx
 * @description Summary dialog after selected-student license batch issuance.
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LicensePreviewHolder, SelectedLicenseBatchResult } from './types';

interface BatchResultModalProps {
  result: SelectedLicenseBatchResult | null;
  holders: LicensePreviewHolder[];
  onClose: () => void;
}

/**
 * Resolves a display name for a skipped student when the preview row is still in memory.
 *
 * @param {LicensePreviewHolder[]} holders - Last preview rows.
 * @param {string} studentId - Academic profile id from `skippedDetails`.
 * @returns {string} Holder name, or the raw id.
 */
function holderLabel(holders: LicensePreviewHolder[], studentId: string): string {
  const holder = holders.find((row) => row.studentProfileId === studentId);
  if (!holder) {
    return studentId;
  }
  const name = `${holder.lastName}, ${holder.firstName}`.replace(/^,\s*|,\s*$/g, '').trim();
  return name || studentId;
}

/**
 * Post-batch summary: issued count plus skipped students with translated reasons.
 *
 * @param {BatchResultModalProps} props - Result payload, preview rows, and close handler.
 * @returns {JSX.Element | null} Modal, or `null` when closed.
 */
export function BatchResultModal({ result, holders, onClose }: BatchResultModalProps): JSX.Element | null {
  const { t } = useTranslation();

  if (!result) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
      <Card className="w-full max-w-lg bg-card shadow-xl" role="dialog" aria-modal="true" aria-labelledby="batch-result-title">
        <CardHeader>
          <CardTitle id="batch-result-title">{t('financial.licenses.result_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{result.successCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('financial.licenses.result_success')}</p>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{result.skippedCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('financial.licenses.result_skipped')}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('financial.licenses.result_processed', { count: result.totalProcessed })}
          </p>
          {result.skippedDetails.length === 0 ? (
            <p className="text-sm text-foreground">{t('financial.licenses.result_none_skipped')}</p>
          ) : (
            <ul className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-border p-3">
              {result.skippedDetails.map((detail) => (
                <li key={`${detail.studentId}-${detail.reason}`} className="text-sm text-foreground">
                  <span className="font-medium">{holderLabel(holders, detail.studentId)}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {t(`financial.licenses.skip_reason.${detail.reason}`, {
                      defaultValue: t('financial.licenses.skip_reason.UNKNOWN'),
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end">
            <Button type="button" onClick={onClose}>
              {t('financial.licenses.result_close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
