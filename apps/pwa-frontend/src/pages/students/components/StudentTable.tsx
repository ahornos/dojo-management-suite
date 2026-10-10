/**
 * @file StudentTable.tsx
 * @description Orchestrator component for the student directory table.
 * Manages sorting configuration, search and age range filters, and delegates rendering to sub-components.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StudentProfileResponse } from '../types';
import { AGE_GROUPS } from '../config/ageGroups';
import { StudentTableHeaders, SortKey } from './StudentTableHeaders';
import { StudentTableRow } from './StudentTableRow';

interface StudentTableProps {
  students: StudentProfileResponse[];
  isLoading: boolean;
  error: any;
  searchTerm: string;
  selectedAgeGroups: string[];
  onEdit: (student: StudentProfileResponse) => void;
  onDelete: (id: string) => void;
}

type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
} | null;

export function StudentTable({ students, isLoading, error, searchTerm, selectedAgeGroups, onEdit, onDelete }: StudentTableProps) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  /**
   * Helper function to calculate precise age from birthDate.
   */
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return -1;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getProcessedStudents = () => {
    const filtered = students.filter(s => {
      const birth = s.user?.birthDate || s.birthDate;
      const searchTarget = `${s.user?.firstName || ''} ${s.user?.lastName || ''} ${s.user?.dni || ''} ${s.phone || ''}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());

      const age = calculateAge(birth);
      const matchesAge = selectedAgeGroups.length === 0 || selectedAgeGroups.some(groupId => {
        const group = AGE_GROUPS.find(g => g.id === groupId);
        return group && age >= group.minAge && age <= group.maxAge;
      });

      return matchesSearch && matchesAge;
    });

    return filtered.sort((a, b) => {
      const ageA = calculateAge(a.user?.birthDate || a.birthDate);
      const ageB = calculateAge(b.user?.birthDate || b.birthDate);
      const lastA = a.user?.lastName?.toLowerCase() || '';
      const lastB = b.user?.lastName?.toLowerCase() || '';
      const firstA = a.user?.firstName?.toLowerCase() || '';
      const firstB = b.user?.firstName?.toLowerCase() || '';

      const defaultSort = () => {
        if (ageA !== ageB) return ageB - ageA; // Default: Descending age
        if (lastA !== lastB) return lastA.localeCompare(lastB);
        return firstA.localeCompare(firstB);
      };

      if (!sortConfig) return defaultSort();

      const dirMultiplier = sortConfig.direction === 'asc' ? 1 : -1;

      if (sortConfig.key === 'age' && ageA !== ageB) return (ageA - ageB) * dirMultiplier;
      if (sortConfig.key === 'firstName' && firstA !== firstB) return firstA.localeCompare(firstB) * dirMultiplier;
      if (sortConfig.key === 'lastName' && lastA !== lastB) return lastA.localeCompare(lastB) * dirMultiplier;
      if (sortConfig.key === 'belt') {
        const beltA = a.ranks && a.ranks.length > 0 ? a.ranks[0].beltName.toLowerCase() : '';
        const beltB = b.ranks && b.ranks.length > 0 ? b.ranks[0].beltName.toLowerCase() : '';
        if (beltA !== beltB) return beltA.localeCompare(beltB) * dirMultiplier;
      }

      return defaultSort();
    });
  };

  if (isLoading) return <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">{t('students.loading')}</div>;
  if (error) return <div className="p-6 text-center text-red-600 bg-white rounded-lg shadow">{t('students.error')}</div>;

  const processedStudents = getProcessedStudents();

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <StudentTableHeaders sortConfig={sortConfig} onSort={handleSort} />
          <tbody className="bg-white divide-y divide-gray-200">
            {processedStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">{t('students.no_students')}</td>
              </tr>
            ) : (
              processedStudents.map((student) => (
                <StudentTableRow 
                  key={student.id} 
                  student={student} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}