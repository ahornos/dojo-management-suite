/**
 * @file DisciplineSection.tsx
 * @description Component rendering multi-select disciplines with advanced configuration
 * for custom belt ranks and initial stripes (ideal for students joining from other academies).
 */

import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { getLocalizedBeltName } from '@/lib/beltTranslations';

export interface DisciplineAssignment {
  disciplineId: string;
  beltRankId?: string;
  currentStripes?: number;
}

interface DisciplineSectionProps {
  availableDisciplines: any[];
  selectedDisciplines: DisciplineAssignment[];
  onChange: (disciplines: DisciplineAssignment[]) => void;
}

/**
 * Academic-profile block: discipline enrollment plus optional starting belt and stripes.
 *
 * @param {DisciplineSectionProps} props - Catalog, current assignment, and change handler.
 * @returns {JSX.Element} Section.
 */
export function DisciplineSection({ availableDisciplines, selectedDisciplines, onChange }: DisciplineSectionProps) {
  const { t } = useTranslation();

  const isSelected = (id: string) => selectedDisciplines.some((d) => d.disciplineId === id);

  const handleToggle = (disciplineId: string) => {
    if (isSelected(disciplineId)) {
      onChange(selectedDisciplines.filter((d) => d.disciplineId !== disciplineId));
    } else {
      onChange([...selectedDisciplines, { disciplineId, beltRankId: '', currentStripes: 0 }]);
    }
  };

  const handleBeltChange = (disciplineId: string, beltRankId: string) => {
    onChange(selectedDisciplines.map((d) => (d.disciplineId === disciplineId ? { ...d, beltRankId } : d)));
  };

  const handleStripesChange = (disciplineId: string, currentStripes: number) => {
    onChange(selectedDisciplines.map((d) => (d.disciplineId === disciplineId ? { ...d, currentStripes } : d)));
  };

  return (
    <FormSection title={t('students.form.academic_title')}>
      {availableDisciplines.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">{t('students.form.no_disciplines')}</p>
      ) : (
        <div className="space-y-3">
          {availableDisciplines.map((discipline) => {
            const selectedItem = selectedDisciplines.find((d) => d.disciplineId === discipline.id);
            const selectedChecked = !!selectedItem;

            return (
              <div
                key={discipline.id}
                className={`rounded-lg border p-4 transition-colors ${
                  selectedChecked ? 'border-primary/30 bg-primary/10' : 'border-border bg-card'
                }`}
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={selectedChecked}
                    onChange={() => handleToggle(discipline.id)}
                    aria-label={discipline.name}
                  />
                  <Label className="cursor-pointer text-base font-medium text-foreground">{discipline.name}</Label>
                </label>

                {selectedChecked && selectedItem ? (
                  <FormGrid className="mt-4 border-t border-primary/20 pt-3">
                    <Field id={`belt-${discipline.id}`} label={t('students.form.initial_belt')}>
                      <Select
                        id={`belt-${discipline.id}`}
                        value={selectedItem.beltRankId || ''}
                        onChange={(e) => handleBeltChange(discipline.id, e.target.value)}
                      >
                        <option value="">{t('students.form.default_belt')}</option>
                        {discipline.programs
                          ?.flatMap((prog: any) => prog.beltRanks || [])
                          .map((belt: any) => (
                            <option key={belt.id} value={belt.id}>
                              {getLocalizedBeltName(belt.name, t)}
                            </option>
                          ))}
                      </Select>
                    </Field>
                    <Field id={`stripes-${discipline.id}`} label={t('students.form.stripes')}>
                      <Input
                        id={`stripes-${discipline.id}`}
                        type="number"
                        min={0}
                        max={6}
                        value={selectedItem.currentStripes ?? 0}
                        onChange={(e) => handleStripesChange(discipline.id, parseInt(e.target.value, 10) || 0)}
                      />
                    </Field>
                  </FormGrid>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </FormSection>
  );
}
