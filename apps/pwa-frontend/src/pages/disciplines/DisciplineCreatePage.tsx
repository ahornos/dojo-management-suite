/**
 * @file DisciplineCreatePage.tsx
 * @description Dedicated `/disciplines/new` route for creating a martial discipline.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { DisciplineForm } from './DisciplineForm';
import { useDisciplines } from './useDisciplines';
import type { DisciplinePayload } from './types';

/**
 * Create-discipline form page. Redirects to the catalog on success.
 *
 * @returns {JSX.Element} Create view.
 */
export default function DisciplineCreatePage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createDiscipline } = useDisciplines();

  /**
   * Persists a new discipline and returns to `/disciplines`.
   *
   * @param {DisciplinePayload} data - Name, acronym, description.
   * @returns {void}
   */
  const handleSubmit = (data: DisciplinePayload): void => {
    createDiscipline.mutate(data, {
      onSuccess: () => navigate('/disciplines', { replace: true }),
    });
  };

  return (
    <EntityFormPage backTo="/disciplines" title={t('disciplines.create_title')} maxWidth="max-w-3xl">
      <DisciplineForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/disciplines')}
        isPending={createDiscipline.isPending}
      />
    </EntityFormPage>
  );
}
