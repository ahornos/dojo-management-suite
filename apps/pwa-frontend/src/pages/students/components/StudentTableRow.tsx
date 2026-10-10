/**
 * @file StudentTableRow.tsx
 * @description Presentational component rendering an individual student table row.
 * Universally handles both JSON emergency contacts for adults and structured Guardians for minors.
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { getLocalizedBeltName } from '@/lib/beltTranslations';
import { StudentProfileResponse } from '../types';
import { useMemo } from 'react';

interface StudentTableRowProps {
  student: StudentProfileResponse;
  onEdit: (student: StudentProfileResponse) => void;
  onDelete: (id: string) => void;
}

export function StudentTableRow({ student, onEdit, onDelete }: StudentTableRowProps) {
  const { t } = useTranslation();

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

  const birthDate = student.user?.birthDate || student.birthDate;
  const age = calculateAge(birthDate);
  const isMinor = age !== -1 && age < 18;
  
  // Unify display logic dynamically based on data source
  const displayContacts = useMemo(() => {
    if (isMinor) {
      return (student as any).guardians?.map((g: any) => ({
        name: `${g.guardian?.user?.firstName || ''} ${g.guardian?.user?.lastName || ''}`.trim(),
        phone: g.guardian?.user?.phone || 'Sin teléfono',
        rel: g.relationship || 'Tutor'
      })) || [];
    } else {
      return student.emergencyContacts?.map(c => ({
        name: c.name,
        phone: c.phone,
        rel: c.relationship
      })) || [];
    }
  }, [student, isMinor]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {age !== -1 ? `${age} ${t('disciplines.years')}` : '-'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {student.user?.firstName}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {student.user?.lastName}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {student.ranks && student.ranks.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {student.ranks.map(rank => (
              <div key={rank.id} className="text-sm">
                <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded mr-1.5 inline-block">
                  {rank.disciplineName}
                </span>
                <span className="text-gray-800 font-medium">
                  {getLocalizedBeltName(rank.beltName, t)}
                </span>
                <span className="text-gray-500 ml-1 text-xs">
                  ({rank.currentStripes} {rank.currentStripes === 1 ? 'raya' : 'rayas'})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Sin disciplina / grado</span>
        )}
      </td>

      {/* Unified Emergency Contact Column */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {displayContacts.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {displayContacts.map((contact: any, index: number) => (
                <div key={index} className="text-xs flex items-center">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mr-2 border border-blue-100/50 whitespace-nowrap">
                    {contact.rel}
                  </span>
                  <span className="font-medium text-gray-800 mr-1 whitespace-nowrap">{contact.name}</span>
                  <span className="text-gray-500 whitespace-nowrap">- {contact.phone}</span>
                </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic">No registrado</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(student)}>
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 border-red-200" onClick={() => onDelete(student.id)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </td>
    </tr>
  );
}