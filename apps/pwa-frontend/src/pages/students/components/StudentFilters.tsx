/**
 * @file StudentFilters.tsx
 * @description Renders the search bar and a multi-select visual filter for age ranges.
 */

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AGE_GROUPS } from '../config/ageGroups';

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAgeGroups: string[];
  onAgeGroupToggle: (groupId: string) => void;
}

export function StudentFilters({ searchTerm, onSearchChange, selectedAgeGroups, onAgeGroupToggle }: StudentFiltersProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="w-full sm:w-1/2 md:w-1/3">
        <Input
          placeholder={t('students.search_placeholder', 'Search by name, last name, DNI or phone...')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-500 mr-2">{t('students.filter_age')}:</span>
        
        <Badge 
          variant={selectedAgeGroups.length === 0 ? "default" : "outline"}
          className="cursor-pointer transition-colors"
          onClick={() => onAgeGroupToggle('ALL')}
        >
          {t('students.all_ages')}
        </Badge>
        
        {AGE_GROUPS.map(group => (
          <Badge
            key={group.id}
            variant={selectedAgeGroups.includes(group.id) ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => onAgeGroupToggle(group.id)}
          >
            {t(group.labelKey)}
          </Badge>
        ))}
      </div>
    </div>
  );
}