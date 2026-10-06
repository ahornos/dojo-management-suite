/**
 * @file Students.tsx
 * @description Main Students module view. Displays student profiles with their active martial rank
 * and emergency contacts. Delegates creation to the StudentForm component.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudents } from './useStudents';
import { StudentForm } from './StudentForm';
import { Button } from '@/components/ui/button';
import { getLocalizedBeltName } from '@/lib/beltTranslations';

export default function Students() {
  const { t } = useTranslation();
  const { students, availableUsers, isLoading, error, createStudent } = useStudents();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSubmit = (data: any) => {
    createStudent.mutate(data, {
      onSuccess: () => setIsCreating(false),
    });
  };

  if (isLoading) return <div className="p-6">{t('students.loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{t('students.error')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('students.title')}</h1>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white hover:bg-blue-700">
            {t('students.new_student')}
          </Button>
        )}
      </div>

      {isCreating ? (
        <StudentForm 
          availableUsers={availableUsers} 
          onSubmit={handleCreateSubmit} 
          onCancel={() => setIsCreating(false)} 
          isPending={createStudent.isPending} 
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('students.first_name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">{t('students.no_students')}</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{student.user?.firstName} {student.user?.lastName}</div>
                      <div className="text-xs text-gray-500">{student.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {student.activeRank ? (
                        <div className="text-sm font-semibold text-gray-800">
                           {getLocalizedBeltName(student.activeRank.beltName, t)} 
                           <span className="text-gray-500 ml-1">({student.activeRank.currentStripes} stripes)</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No rank assigned</span>
                      )}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.emergencyContactName ? (
                        <>
                          <div className="font-medium">{student.emergencyContactName}</div>
                          <div className="text-xs">{student.emergencyContactPhone}</div>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t('students.active')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}