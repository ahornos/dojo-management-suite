/**
 * @file Users.tsx
 * @description User directory list. Create/edit live on dedicated sub-routes.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useUsers } from './useUsers';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';
import { DeleteUserModal } from './DeleteUserModal';
import type { UserDirectoryRecord } from './mapUserForm';

/**
 * Users administration list: filter, delete confirmation, and links to form routes.
 *
 * @returns {JSX.Element} The users directory.
 */
export default function Users(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { users, isLoading, error, deleteMutation } = useUsers();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleRoleToggle = (role: string) => {
    if (role === 'ALL') {
      setSelectedRoles([]);
      return;
    }
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  if (isLoading) return <div className="p-6">{t('users.loading')}</div>;
  if (error) return <div className="p-6 text-destructive">{t('users.error')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('users.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('users.subtitle')}</p>
        </div>
        <Button
          onClick={() => navigate('/users/new')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {t('users.new_user')}
        </Button>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRoles={selectedRoles}
        onRoleToggle={handleRoleToggle}
      />

      <UserTable
        users={users as UserDirectoryRecord[]}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        selectedRoles={selectedRoles}
        onEdit={(user) => navigate(`/users/${user.id}/edit`)}
        onDelete={setUserToDelete}
      />

      <DeleteUserModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() =>
          userToDelete &&
          deleteMutation.mutate(userToDelete, {
            onSuccess: () => setUserToDelete(null),
          })
        }
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
