/**
 * @file StudentCreatePage.tsx
 * @description Dedicated `/students/new` route for registering an ACTIVE student.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { StudentCreateForm } from './forms/StudentCreateForm';
import { useStudents } from './useStudents';
import type { CreateStudentPayload, StudentsListLocationState } from './types';

/**
 * Create-student form page. On success, returns to the directory with optional SEPA flash state.
 *
 * @returns {JSX.Element} Create view.
 */
export default function StudentCreatePage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { availableUsers, availableDisciplines, createStudent } = useStudents();

  /**
   * Persists the profile and redirects to the list, carrying mandate status for staff banners.
   *
   * @param {CreateStudentPayload} data - Academic payload plus banking details.
   * @returns {void}
   */
  const handleSubmit = (data: CreateStudentPayload): void => {
    createStudent.mutate(data, {
      onSuccess: (result) => {
        const state: StudentsListLocationState = {
          mandateFailed: result.mandateFailed,
          mandate: result.mandate && !result.mandate.isSigned ? result.mandate : null,
        };
        navigate('/students', { replace: true, state });
      },
    });
  };

  return (
    <EntityFormPage backTo="/students" title={t('students.create_title')} maxWidth="max-w-5xl">
      <StudentCreateForm
        availableUsers={availableUsers}
        availableDisciplines={availableDisciplines}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/students')}
        isPending={createStudent.isPending}
      />
    </EntityFormPage>
  );
}
