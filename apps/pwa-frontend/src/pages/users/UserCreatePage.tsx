/**
 * @file UserCreatePage.tsx
 * @description Dedicated `/users/new` route for registering a staff/system user.
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EntityFormPage } from '@/components/layout/EntityFormPage';
import { UserForm } from './UserForm';
import { useUsers } from './useUsers';
import type { UserFormPayload } from './types';

/**
 * Create-user form page. Redirects to the directory on success.
 *
 * @returns {JSX.Element} Create view.
 */
export default function UserCreatePage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createMutation } = useUsers();

  /**
   * Persists a new user and returns to `/users`.
   *
   * @param {UserFormPayload} data - Form values.
   * @returns {void}
   */
  const handleSubmit = (data: UserFormPayload): void => {
    createMutation.mutate(data, {
      onSuccess: () => navigate('/users', { replace: true }),
    });
  };

  return (
    <EntityFormPage backTo="/users" title={t('users.create_title')} maxWidth="max-w-5xl">
      <UserForm
        initialData={null}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
        isPending={createMutation.isPending}
      />
    </EntityFormPage>
  );
}
