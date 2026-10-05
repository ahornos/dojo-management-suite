/**
 * @file UserFilters.tsx
 * @description Renders the search bar and a multi-select visual filter for user roles.
 */

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRoles: string[];
  onRoleToggle: (role: string) => void;
}

const AVAILABLE_ROLES = [
  'SUPER_ADMIN', 
  'ADMIN_STAFF', 
  'SPORTS_TECHNICAL_DIRECTOR', 
  'INSTRUCTOR', 
  'STUDENT', 
  'PARENT'
];

/**
 * Filter component for the Users table.
 * Includes a text search and a visual multi-select badge group for roles.
 */
export function UserFilters({ searchTerm, onSearchChange, selectedRoles, onRoleToggle }: UserFiltersProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="w-full sm:w-1/2 md:w-1/3">
        <Input
          placeholder={t('users.search_placeholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Visual Multi-Select for Roles */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-500 mr-2">{t('users.filter_role')}:</span>
        
        {/* "All Roles" acts as a reset button */}
        <Badge 
          variant={selectedRoles.length === 0 ? "default" : "outline"}
          className="cursor-pointer transition-colors"
          onClick={() => onRoleToggle('ALL')}
        >
          {t('users.all_roles')}
        </Badge>
        
        {AVAILABLE_ROLES.map(role => (
          <Badge
            key={role}
            variant={selectedRoles.includes(role) ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => onRoleToggle(role)}
          >
            {role}
          </Badge>
        ))}
      </div>
    </div>
  );
}