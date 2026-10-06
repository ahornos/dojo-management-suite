/**
 * @file BeltRankModal.tsx
 * @description Modal dialog for managing belt ranks, stripe limits, and promotion requirements.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white shadow-xl">
        <CardHeader>
          <CardTitle>
            {beltRank ? t('belts.edit_title') : t('belts.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="belt-name">{t('belts.name_label')}</Label>
                <Input
                  id="belt-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., White Belt"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="belt-order">{t('belts.order_label')}</Label>
                <Input
                  id="belt-order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-stripes">{t('belts.max_stripes')}</Label>
                <Input
                  id="max-stripes"
                  type="number"
                  value={maxStripes}
                  onChange={(e) => setMaxStripes(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-months">{t('belts.min_months')}</Label>
                <Input
                  id="min-months"
                  type="number"
                  value={minMonths}
                  onChange={(e) => setMinMonths(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-hours">{t('belts.min_hours')}</Label>
                <Input
                  id="min-hours"
                  type="number"
                  value={minHours}
                  onChange={(e) => setMinHours(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
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