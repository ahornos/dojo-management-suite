/**
 * @file StudentTableHeaders.tsx
 * @description Renders table header columns with interactive sorting indicators.
 */

import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

export type SortKey = 'age' | 'firstName' | 'lastName' | 'belt';

export type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
} | null;

interface StudentTableHeadersProps {
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

export function StudentTableHeaders({ sortConfig, onSort }: StudentTableHeadersProps) {
  const { t } = useTranslation();

  /**
   * Internal sub-component for rendering individual sortable table headers.
   */
  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{t(label)}</span>
        <span className="text-gray-400 group-hover:text-gray-600">
          {sortConfig?.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50">
      <tr>
        <SortableHeader label="students.table_age" sortKey="age" />
        <SortableHeader label="students.first_name" sortKey="firstName" />
        <SortableHeader label="students.last_name" sortKey="lastName" />
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {t('students.table_discipline')} & Ranks
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {t('students.table_emergency')}
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          {t('users.table_actions')}
        </th>
      </tr>
    </thead>
  );
}