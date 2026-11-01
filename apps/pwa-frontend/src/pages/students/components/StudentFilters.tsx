/**
 * @file StudentFilters.tsx
 * @description Compact toolbar: search plus multi-select age, status, and discipline filters.
 */

import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AGE_GROUPS, ageGroupLabel, type AgeGroupConfig } from '../config/ageGroups';
import { STUDENT_STATUS_OPTIONS } from '../listFilters';
import { MultiSelectFilter } from './MultiSelectFilter';

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAgeGroups: string[];
  onAgeGroupsChange: (next: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (next: string[]) => void;
  selectedDisciplines: string[];
  onDisciplinesChange: (next: string[]) => void;
  disciplineOptions: string[];
  showClear: boolean;
  onClearFilters: () => void;
  ageGroups?: AgeGroupConfig[];
}

/**
 * Horizontal filter bar for the student directory.
 *
 * @param {StudentFiltersProps} props - Search, selections, and clear handler.
 * @returns {JSX.Element} Toolbar.
 */
export function StudentFilters({
  searchTerm,
  onSearchChange,
  selectedAgeGroups,
  onAgeGroupsChange,
  selectedStatuses,
  onStatusesChange,
  selectedDisciplines,
  onDisciplinesChange,
  disciplineOptions,
  showClear,
  onClearFilters,
  ageGroups = AGE_GROUPS,
}: StudentFiltersProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm md:flex-row md:flex-wrap md:items-end">
      <div className="min-w-[12rem] flex-1">
        <Input
          placeholder={t('students.search_placeholder')}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-9"
        />
      </div>

      <MultiSelectFilter
        label={t('students.filter_age')}
        emptyLabel={t('students.all_ages')}
        selected={selectedAgeGroups}
        onChange={onAgeGroupsChange}
        options={ageGroups.map((group) => ({ value: group.id, label: ageGroupLabel(group, t) }))}
      />

      <MultiSelectFilter
        label={t('students.filter_status')}
        emptyLabel={t('students.all_statuses')}
        selected={selectedStatuses}
        onChange={onStatusesChange}
        options={STUDENT_STATUS_OPTIONS.map((status) => ({
          value: status,
          label: t(`enums.status.${status}`),
        }))}
      />

      <MultiSelectFilter
        label={t('students.filter_discipline')}
        emptyLabel={t('students.all_disciplines')}
        selected={selectedDisciplines}
        onChange={onDisciplinesChange}
        options={disciplineOptions.map((name) => ({ value: name, label: name }))}
      />

      {showClear && (
        <Button type="button" variant="ghost" size="sm" className="h-9" onClick={onClearFilters}>
          <X className="h-4 w-4" />
          {t('students.clear_filters')}
        </Button>
      )}
    </div>
  );
}
