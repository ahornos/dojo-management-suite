/**
 * @file UserEditPage.tsx
 * @description Dedicated `/users/:id/edit` route for updating a system user.
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { UserForm } from './UserForm';
import { useUsers } from './useUsers';
import { toUserFormPayload, userDisplayName, type UserDirectoryRecord } from './mapUserForm';
import type { UserFormPayload } from './types';

/**
 * Edit-user form page. Resolves the record from the directory query.
 *
 * @returns {JSX.Element} Edit view.
 */
export default function UserEditPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, isLoading, error, updateMutation } = useUsers();

  const record = (users as UserDirectoryRecord[]).find((user) => user.id === id);
  const title = record
    ? t('users.edit_named', { name: userDisplayName(record) })
    : t('users.edit_modal_title');

  /**
   * Persists the PATCH and returns to `/users`.
   *
   * @param {UserFormPayload} data - Form values including `id`.
   * @returns {void}
   */
  const handleSubmit = (data: UserFormPayload): void => {
    updateMutation.mutate(data, {
      onSuccess: () => navigate('/users', { replace: true }),
    });
  };

  const notFound = !isLoading && !error && !record;

  return (
    <EntityFormPage
      backTo="/users"
      title={title}
      maxWidth="max-w-5xl"
      isLoading={isLoading}
      errorMessage={error ? t('users.error') : notFound ? t('common.not_found') : null}
    >
      {record ? (
        <UserForm
          initialData={toUserFormPayload(record)}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/users')}
          isPending={updateMutation.isPending}
        />
      ) : null}
    </EntityFormPage>
  );
}
