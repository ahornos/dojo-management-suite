/**
 * @file DisciplineSection.tsx
 * @description Component rendering multi-select disciplines with advanced configuration 
 * for custom belt ranks and initial stripes (ideal for students joining from other academies).
 */

import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';

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

export function DisciplineSection({ availableDisciplines, selectedDisciplines, onChange }: DisciplineSectionProps) {
  const { t } = useTranslation();

  const isSelected = (id: string) => selectedDisciplines.some(d => d.disciplineId === id);

  const handleToggle = (disciplineId: string) => {
    if (isSelected(disciplineId)) {
      onChange(selectedDisciplines.filter(d => d.disciplineId !== disciplineId));
    } else {
      onChange([...selectedDisciplines, { disciplineId, beltRankId: '', currentStripes: 0 }]);
    }
  };

  const handleBeltChange = (disciplineId: string, beltRankId: string) => {
    onChange(selectedDisciplines.map(d => d.disciplineId === disciplineId ? { ...d, beltRankId } : d));
  };

  const handleStripesChange = (disciplineId: string, currentStripes: number) => {
    onChange(selectedDisciplines.map(d => d.disciplineId === disciplineId ? { ...d, currentStripes } : d));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        {t('students.table_discipline')} & Ranks
      </h3>
      
      {availableDisciplines.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No hay disciplinas configuradas en el sistema.</p>
      ) : (
        <div className="space-y-3">
          {availableDisciplines.map(discipline => {
            const selectedItem = selectedDisciplines.find(d => d.disciplineId === discipline.id);
            const selectedChecked = !!selectedItem;

            return (
              <div 
                key={discipline.id} 
                className={`p-4 rounded-lg border transition-colors ${
                  selectedChecked ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between cursor-pointer" onClick={() => handleToggle(discipline.id)}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedChecked}
                      onChange={() => {}} 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label className="cursor-pointer font-medium text-gray-800 text-base">
                      {discipline.name}
                    </Label>
                  </div>
                </div>

                {/* Sub-selectors for Belt and Stripes when discipline is active */}
                {selectedChecked && (
                  <div className="mt-4 pt-3 border-t border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Cinturón Inicial / Grado</label>
                      <select 
                        value={selectedItem.beltRankId || ''} 
                        onChange={(e) => handleBeltChange(discipline.id, e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-md p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Por defecto (Cinturón inicial)</option>
                        {discipline.programs?.flatMap((prog: any) => prog.beltRanks || []).map((belt: any) => (
                          <option key={belt.id} value={belt.id}>
                            {belt.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Nº de Rayas / Grados</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="6"
                        value={selectedItem.currentStripes ?? 0}
                        onChange={(e) => handleStripesChange(discipline.id, parseInt(e.target.value) || 0)}
                        className="w-full text-sm border border-gray-300 rounded-md p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}