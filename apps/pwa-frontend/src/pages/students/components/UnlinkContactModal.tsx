/**
 * @file UnlinkContactModal.tsx
 * @description Confirmation modal for unlinking a guardian or emergency contact from a student.
 * Clarifies that the user account itself will not be deleted, only the relationship.
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface UnlinkContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnlinkContactModal({ isOpen, onClose, onConfirm }: UnlinkContactModalProps): JSX.Element | null {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-card shadow-xl border-warning/40">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="bg-warning/15 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <CardTitle className="text-foreground text-lg">{t('students.form.unlink_contact_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {t('students.form.unlink_contact_message')}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button className="bg-warning hover:bg-warning/90 text-warning-foreground" onClick={onConfirm}>
              {t('students.form.unlink_contact_confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}