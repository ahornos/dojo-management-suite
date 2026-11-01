/**
 * @file BeltRankModal.tsx
 * @description Modal dialog for managing belt ranks, stripe limits, and promotion requirements.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BeltRankPayload } from './types';

interface BeltRankModalProps {
  isOpen: boolean;
  beltRank: BeltRankPayload | null;
  programId: string;
  onClose: () => void;
  onSubmit: (data: BeltRankPayload) => void;
  isPending: boolean;
}

/**
 * Create/edit dialog for a belt rank (order, stripes, and promotion thresholds).
 *
 * @param {BeltRankModalProps} props - Optional existing rank, parent program id, and submit handler.
 * @returns {JSX.Element | null} The modal, or `null` when closed.
 */
export function BeltRankModal({ isOpen, beltRank, programId, onClose, onSubmit, isPending }: BeltRankModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [order, setOrder] = useState<number>(1);
  const [maxStripes, setMaxStripes] = useState<number>(4);
  const [minMonths, setMinMonths] = useState<number>(0);
  const [minHours, setMinHours] = useState<number>(0);

  useEffect(() => {
    if (beltRank) {
      setName(beltRank.name || '');
      setOrder(beltRank.order || 1);
      setMaxStripes(beltRank.maxStripes ?? 4);
      setMinMonths(beltRank.minMonthsRequired || 0);
      setMinHours(beltRank.minHoursRequired || 0);
    } else {
      setName('');
      setOrder(1);
      setMaxStripes(4);
      setMinMonths(0);
      setMinHours(0);
    }
  }, [beltRank]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: beltRank?.id,
      disciplineProgramId: programId,
      name,
      order: Number(order),
      maxStripes: Number(maxStripes),
      minMonthsRequired: Number(minMonths),
      minHoursRequired: Number(minHours),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
      <Card className="w-full max-w-lg bg-card shadow-xl">
        <CardHeader>
          <CardTitle>
            {beltRank ? t('belts.edit_title') : t('belts.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title={beltRank ? t('belts.edit_title') : t('belts.create_title')}>
              <FormGrid>
                <Field id="belt-name" label={t('belts.name_label')} required>
                  <Input
                    id="belt-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('belts.name_placeholder')}
                    required
                  />
                </Field>
                <Field id="belt-order" label={t('belts.order_label')} required>
                  <Input
                    id="belt-order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    required
                  />
                </Field>
                <Field id="max-stripes" label={t('belts.max_stripes')} required>
                  <Input
                    id="max-stripes"
                    type="number"
                    value={maxStripes}
                    onChange={(e) => setMaxStripes(Number(e.target.value))}
                    required
                  />
                </Field>
                <Field id="min-months" label={t('belts.min_months')} required>
                  <Input
                    id="min-months"
                    type="number"
                    value={minMonths}
                    onChange={(e) => setMinMonths(Number(e.target.value))}
                    required
                  />
                </Field>
                <Field id="min-hours" label={t('belts.min_hours')} required>
                  <Input
                    id="min-hours"
                    type="number"
                    value={minHours}
                    onChange={(e) => setMinHours(Number(e.target.value))}
                    required
                  />
                </Field>
              </FormGrid>
            </FormSection>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                {t('belts.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('belts.saving') : t('belts.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}