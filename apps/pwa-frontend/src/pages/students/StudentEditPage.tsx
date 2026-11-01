/**
 * @file StudentEditPage.tsx
 * @description Dedicated `/students/:id/edit` route for updating a student profile.
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { StudentEditForm } from './forms/StudentEditForm';
import { studentDisplayName } from './studentIdentity';
import { useStudent, useStudents } from './useStudents';
import type { StudentProfileResponse, StudentRankPayload, StudentsListLocationState, UpdateStudentPayload } from './types';

interface NestedRank extends StudentRankPayload {
  beltRank?: { program?: { disciplineId?: string } };
}

/**
 * Normalizes `findOne` nested ranks so the edit form can map `disciplineId`.
 *
 * @param {StudentProfileResponse} student - Profile from GET `/academic/students/:id`.
 * @returns {StudentProfileResponse} Profile with flattened rank discipline ids.
 */
function withFlattenedRanks(student: StudentProfileResponse): StudentProfileResponse {
  const ranks = (student.ranks ?? []).map((rank) => {
    const nested = rank as NestedRank;
    return {
      ...rank,
      disciplineId: nested.disciplineId ?? nested.beltRank?.program?.disciplineId,
    };
  });
  return { ...student, ranks };
}

/**
 * Directory display name for the page title.
 *
 * @param {StudentProfileResponse} student - Profile being edited.
 * @returns {string} `lastName, firstName` or a fallback.
 */
function directoryName(student: StudentProfileResponse): string {
  const { firstName, lastName } = studentDisplayName(student);
  const last = lastName.trim();
  const first = firstName.trim();
  if (last && first) return `${last}, ${first}`;
  return last || first || student.id.slice(0, 8);
}

/**
 * Edit-student form page. On success, returns to the directory with optional SEPA flash state.
 *
 * @returns {JSX.Element} Edit view.
 */
export default function StudentEditPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useStudent(id);
  const { availableUsers, availableDisciplines, updateStudent } = useStudents();

  /**
   * Persists the PATCH and redirects to the list.
   *
   * @param {UpdateStudentPayload} payload - Academic PATCH body plus optional banking.
   * @returns {void}
   */
  const handleSubmit = (payload: UpdateStudentPayload): void => {
    if (!id) return;
    updateStudent.mutate(
      { id, payload },
      {
        onSuccess: (result) => {
          const state: StudentsListLocationState = {
            mandateFailed: result.mandateFailed,
            mandate: result.mandate && !result.mandate.isSigned ? result.mandate : null,
          };
          navigate('/students', { replace: true, state });
        },
      },
    );
  };

  const student = data ? withFlattenedRanks(data) : null;
  const title = student
    ? t('students.edit_named', { name: directoryName(student) })
    : t('students.edit_title');

  return (
    <EntityFormPage
      backTo="/students"
      title={title}
      maxWidth="max-w-5xl"
      isLoading={isLoading}
      errorMessage={isError || (!isLoading && !student) ? t('common.not_found') : null}
    >
      {student ? (
        <StudentEditForm
          initialData={student}
          availableUsers={availableUsers}
          availableDisciplines={availableDisciplines}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/students')}
          isPending={updateStudent.isPending}
        />
      ) : null}
    </EntityFormPage>
  );
}
