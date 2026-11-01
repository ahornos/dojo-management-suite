/**
 * @file FederationCreatePage.tsx
 * @description Dedicated `/federations/new` route for registering a federation.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { FederationForm } from './FederationForm';
import { toFederationPayload, useFederations } from './useFederations';
import type { FederationFormValues } from './schema';

/**
 * Create-federation form page. Redirects to the catalog on success.
 *
 * @returns {JSX.Element} Create view.
 */
export default function FederationCreatePage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createFederation } = useFederations();

  /**
   * Persists a new catalog row and returns to `/federations`.
   *
   * @param {FederationFormValues} values - Validated form values.
   * @returns {void}
   */
  const handleSubmit = (values: FederationFormValues): void => {
    createFederation.mutate(toFederationPayload(values), {
      onSuccess: () => navigate('/federations', { replace: true }),
    });
  };

  return (
    <EntityFormPage
      backTo="/federations"
      title={t('financial.federations.create_title')}
      maxWidth="max-w-6xl"
    >
      <FederationForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/federations')}
        isPending={createFederation.isPending}
      />
    </EntityFormPage>
  );
}
