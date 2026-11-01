/**
 * @file AppearanceNameDialog.tsx
 * @description Modal used to name a new custom appearance or rename an existing one.
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AppearanceNameDialogProps {
  open: boolean;
  mode: 'create' | 'rename';
  initialName?: string;
  pending?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

/**
 * Collects a 2–80 character appearance title.
 *
 * @param {AppearanceNameDialogProps} props - Visibility, mode, and submit handlers.
 * @returns {JSX.Element | null} Dialog, or null when closed.
 */
export function AppearanceNameDialog({
  open,
  mode,
  initialName = '',
  pending = false,
  onClose,
  onSubmit,
}: AppearanceNameDialogProps): JSX.Element | null {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  if (!open) {
    return null;
  }

  const trimmed = name.trim();
  const invalid = trimmed.length < 2 || trimmed.length > 80;

  /**
   * Submits the trimmed title when it is within the allowed length.
   *
   * @returns {void}
   */
  const submit = (): void => {
    if (invalid || pending) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-[var(--space-density)]">
      <Card className="w-full max-w-md" role="dialog" aria-modal="true" aria-labelledby="appearance-name-title">
        <CardHeader>
          <CardTitle id="appearance-name-title">
            {t(mode === 'create' ? 'settings.appearances_save_as_title' : 'settings.appearances_rename_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-[var(--space-gap)]">
          <p className="text-sm text-muted-foreground">
            {t(mode === 'create' ? 'settings.appearances_save_as_help' : 'settings.appearances_rename_help')}
          </p>
          <div className="space-y-2">
            <Label htmlFor="appearance-name">{t('settings.appearances_name')}</Label>
            <Input
              id="appearance-name"
              value={name}
              autoFocus
              maxLength={80}
              placeholder={t('settings.appearances_name_placeholder')}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  submit();
                }
              }}
            />
            {name.trim().length > 0 && invalid ? (
              <p className="text-sm text-destructive">{t('settings.appearances_name_required')}</p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              {t('common.cancel')}
            </Button>
            <Button type="button" onClick={submit} disabled={invalid || pending}>
              {pending
                ? t('settings.saving')
                : t(mode === 'create' ? 'settings.appearances_create' : 'settings.appearances_rename')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
