/**
 * @file DeleteFederationModal.tsx
 * @description SUPER_ADMIN choice between soft-delete (hide) and hard-delete (cascade wipe).
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Federation } from './types';

interface DeleteFederationModalProps {
  federation: Federation | null;
  isPending: boolean;
  onClose: () => void;
  onSoftDelete: () => void;
  onHardDelete: () => void;
}

/**
 * Confirmation dialog offering soft vs hard delete for a federation.
 *
 * @param {DeleteFederationModalProps} props - Target row, pending flag, and handlers.
 * @returns {JSX.Element | null} Modal, or `null` when closed.
 */
export function DeleteFederationModal({
  federation,
  isPending,
  onClose,
  onSoftDelete,
  onHardDelete,
}: DeleteFederationModalProps): JSX.Element | null {
  const { t } = useTranslation();

  if (!federation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
      <Card className="w-full max-w-lg bg-card shadow-xl" role="dialog" aria-modal="true">
        <CardHeader>
          <CardTitle className="text-destructive">
            {t('financial.federations.delete_title', { name: federation.name })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('financial.federations.delete_help')}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-sm font-medium text-foreground">{t('financial.federations.delete_soft')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('financial.federations.delete_soft_help')}</p>
            </div>
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
              <p className="text-sm font-medium text-destructive">{t('financial.federations.delete_hard')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('financial.federations.delete_hard_help')}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t('financial.federations.cancel')}
            </Button>
            <Button type="button" variant="outline" onClick={onSoftDelete} disabled={isPending}>
              {isPending ? t('financial.federations.deleting') : t('financial.federations.delete_soft')}
            </Button>
            <Button type="button" variant="destructive" onClick={onHardDelete} disabled={isPending}>
              {isPending ? t('financial.federations.deleting') : t('financial.federations.delete_hard')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
