/**
 * @file FederationEditPage.tsx
 * @description Dedicated `/federations/:id/edit` route for updating a federation.
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { translateApiError } from '@/lib/errors';
import { FederationForm } from './FederationForm';
import { toFederationPayload, useFederations } from './useFederations';
import type { FederationFormValues } from './schema';

/**
 * Edit-federation form page. Resolves the record from the catalog query.
 *
 * @returns {JSX.Element} Edit view.
 */
export default function FederationEditPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { federations, isLoading, error, updateFederation } = useFederations();

  const record = federations.find((federation) => federation.id === id);
  const title = record
    ? t('financial.federations.edit_named', { name: record.name })
    : t('financial.federations.edit_title');

  /**
   * Persists the PATCH and returns to `/federations`.
   *
   * @param {FederationFormValues} values - Validated form values.
   * @returns {void}
   */
  const handleSubmit = (values: FederationFormValues): void => {
    if (!record) return;
    updateFederation.mutate(
      { id: record.id, ...toFederationPayload(values) },
      { onSuccess: () => navigate('/federations', { replace: true }) },
    );
  };

  const notFound = !isLoading && !error && !record;
  const errorMessage = error
    ? translateApiError(t, error, 'financial.federations.load_error')
    : notFound
      ? t('common.not_found')
      : null;

  return (
    <EntityFormPage
      backTo="/federations"
      title={title}
      maxWidth="max-w-6xl"
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      {record ? (
        <FederationForm
          federation={record}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/federations')}
          isPending={updateFederation.isPending}
        />
      ) : null}
    </EntityFormPage>
  );
}
