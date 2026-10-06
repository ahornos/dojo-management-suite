/**
 * @file DisciplineModal.tsx
 * @description Modal dialog for creating or editing martial disciplines.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DisciplinePayload } from './types';

interface DisciplineModalProps {
  isOpen: boolean;
  discipline: DisciplinePayload | null;
  onClose: () => void;
  onSubmit: (data: DisciplinePayload) => void;
  isPending: boolean;
}

export function DisciplineModal({ isOpen, discipline, onClose, onSubmit, isPending }: DisciplineModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (discipline) {
      setName(discipline.name || '');
      setDescription(discipline.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [discipline]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: discipline?.id,
      name,
      description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white shadow-xl">
        <CardHeader>
          <CardTitle>
            {discipline ? t('disciplines.edit_title') : t('disciplines.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discipline-name">{t('disciplines.name_label')}</Label>
              <Input
                id="discipline-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Brazilian Jiu-Jitsu"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discipline-desc">{t('disciplines.desc_label')}</Label>
              <Input
                id="discipline-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Gentle art focusing on grappling"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                {t('disciplines.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('disciplines.saving') : t('disciplines.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}