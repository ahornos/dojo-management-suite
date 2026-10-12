/**
 * @file DeleteUserModal.tsx
 * @description Confirmation modal for permanently deleting a user account.
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

/**
 * Confirmation dialog for permanently deleting a user account.
 *
 * @param {DeleteUserModalProps} props - Visibility, confirm/cancel handlers, and pending flag.
 * @returns {JSX.Element | null} The modal, or `null` when closed.
 */
export function DeleteUserModal({ isOpen, onClose, onConfirm, isPending }: DeleteUserModalProps): JSX.Element | null {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-card shadow-xl">
        <CardHeader>
          <CardTitle className="text-destructive">{t('users.delete_confirm_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">{t('users.delete_confirm_message')}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              {t('users.cancel')}
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
              {isPending ? t('users.deleting') : t('users.delete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}