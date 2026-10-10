/**
 * @file Students.tsx
 * @description Main Students module orchestrator. Integrates search, filters,
 * interactive table, and delegates forms with disciplines and users props.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudents } from './useStudents';
import { StudentCreateForm } from './forms/StudentCreateForm';
import { StudentEditForm } from './forms/StudentEditForm';
import { StudentFilters } from './components/StudentFilters';
import { StudentTable } from './components/StudentTable';
import { Button } from '@/components/ui/button';
import { StudentProfileResponse } from './types';

export default function Students() {
  const { t } = useTranslation();
  
  const { 
    students, availableUsers, availableDisciplines, 
    isLoading, error, createStudent, updateStudent, deleteStudent 
  } = useStudents();
  
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingStudent, setEditingStudent] = useState<StudentProfileResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);

  const handleAgeGroupToggle = (groupId: string) => {
    if (groupId === 'ALL') {
      setSelectedAgeGroups([]);
      return;
    }
    setSelectedAgeGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]);
  };

  const handleCreateSubmit = (data: any) => {
    createStudent.mutate(data, { onSuccess: () => setFormMode('list') });
  };

  const handleEditSubmit = (data: any) => {
    if (editingStudent) {
      updateStudent.mutate({ id: editingStudent.id, payload: data }, { 
        onSuccess: () => {
          setFormMode('list');
          setEditingStudent(null);
        }
      });
    }
  };

  const handleEditInit = (student: StudentProfileResponse) => {
    setEditingStudent(student);
    setFormMode('edit');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('common.confirm_delete'))) {
      deleteStudent.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('students.title')}</h1>
        </div>
        {formMode === 'list' && (
          <Button onClick={() => setFormMode('create')} className="bg-blue-600 text-white hover:bg-blue-700">
            {t('students.new_student')}
          </Button>
        )}
      </div>

      {formMode === 'create' && (
        <StudentCreateForm 
          availableUsers={availableUsers}
          availableDisciplines={availableDisciplines}
          onSubmit={handleCreateSubmit} 
          onCancel={() => setFormMode('list')} 
          isPending={createStudent.isPending} 
        />
      )}

      {formMode === 'edit' && editingStudent && (
        <StudentEditForm 
          initialData={editingStudent}
          availableUsers={availableUsers}
          availableDisciplines={availableDisciplines}
          onSubmit={handleEditSubmit} 
          onCancel={() => {
            setFormMode('list');
            setEditingStudent(null);
          }} 
          isPending={updateStudent.isPending} 
        />
      )}

      {formMode === 'list' && (
        <>
          <StudentFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedAgeGroups={selectedAgeGroups}
            onAgeGroupToggle={handleAgeGroupToggle}
          />

          <StudentTable 
            students={students}
            isLoading={isLoading}
            error={error}
            searchTerm={searchTerm}
            selectedAgeGroups={selectedAgeGroups}
            onEdit={handleEditInit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}