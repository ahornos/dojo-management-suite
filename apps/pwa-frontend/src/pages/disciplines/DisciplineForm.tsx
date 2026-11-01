/**
 * @file DisciplineForm.tsx
 * @description Create/edit form for a martial discipline (name, acronym, description).
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { DisciplinePayload } from './types';

interface DisciplineFormProps {
  discipline?: DisciplinePayload | null;
  onSubmit: (data: DisciplinePayload) => void;
  onCancel: () => void;
  isPending: boolean;
}

/**
 * Discipline identity form used by `/disciplines/new` and `/disciplines/:id/edit`.
 *
 * @param {DisciplineFormProps} props - Optional existing row, submit/cancel, pending flag.
 * @returns {JSX.Element} Form card.
 */
export function DisciplineForm({ discipline, onSubmit, onCancel, isPending }: DisciplineFormProps): JSX.Element {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [acronym, setAcronym] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (discipline) {
      setName(discipline.name || '');
      setAcronym(discipline.acronym || '');
      setDescription(discipline.description || '');
    } else {
      setName('');
      setAcronym('');
      setDescription('');
    }
  }, [discipline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: discipline?.id,
      name,
      acronym: acronym.trim() || null,
      description,
    });
  };

  const sectionTitle = discipline ? t('disciplines.edit_title') : t('disciplines.create_title');

  return (
    <Card className="w-full border-border shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title={sectionTitle}>
            <FormGrid>
              <Field id="discipline-name" label={t('disciplines.name_label')} required className="md:col-span-2">
                <Input
                  id="discipline-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('disciplines.name_placeholder')}
                  required
                />
              </Field>
              <Field id="discipline-acronym" label={t('disciplines.acronym_label')} className="md:col-span-2">
                <Input
                  id="discipline-acronym"
                  value={acronym}
                  onChange={(e) => setAcronym(e.target.value)}
                  placeholder={t('disciplines.acronym_placeholder')}
                  maxLength={12}
                />
              </Field>
              <Field id="discipline-desc" label={t('disciplines.desc_label')} className="md:col-span-2">
                <Textarea
                  id="discipline-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('disciplines.desc_placeholder')}
                />
              </Field>
            </FormGrid>
          </FormSection>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              {t('disciplines.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('disciplines.saving') : t('disciplines.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
