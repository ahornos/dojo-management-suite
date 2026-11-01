/**
 * @file DisciplineEditPage.tsx
 * @description Dedicated `/disciplines/:id/edit` route for updating a martial discipline.
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { DisciplineForm } from './DisciplineForm';
import { useDisciplines } from './useDisciplines';
import type { DisciplinePayload } from './types';

/**
 * Edit-discipline form page. Resolves the record from the catalog query.
 *
 * @returns {JSX.Element} Edit view.
 */
export default function DisciplineEditPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { disciplines, isLoading, error, updateDiscipline } = useDisciplines();

  const record = (disciplines as DisciplinePayload[]).find((item) => item.id === id);
  const title = record
    ? t('disciplines.edit_named', { name: record.name })
    : t('disciplines.edit_title');

  /**
   * Persists the PATCH and returns to `/disciplines`.
   *
   * @param {DisciplinePayload} data - Form values including `id`.
   * @returns {void}
   */
  const handleSubmit = (data: DisciplinePayload): void => {
    updateDiscipline.mutate(data, {
      onSuccess: () => navigate('/disciplines', { replace: true }),
    });
  };

  const notFound = !isLoading && !error && !record;

  return (
    <EntityFormPage
      backTo="/disciplines"
      title={title}
      maxWidth="max-w-3xl"
      isLoading={isLoading}
      errorMessage={error ? t('disciplines.error') : notFound ? t('common.not_found') : null}
    >
      {record ? (
        <DisciplineForm
          discipline={record}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/disciplines')}
          isPending={updateDiscipline.isPending}
        />
      ) : null}
    </EntityFormPage>
  );
}
