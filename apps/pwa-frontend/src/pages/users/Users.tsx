/**
 * @file Users.tsx
 * @description Administrative user management view orchestrator.
 * Integrates filtering, data table view, and screen-based form navigation for creating/editing.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { UserFormPayload } from './types';
import { useUsers } from './useUsers';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { DeleteUserModal } from './DeleteUserModal';

/**
 * Users administration page: list, filter, create, edit, and delete accounts.
 *
 * @returns {JSX.Element} The users workspace.
 */
export function Users(): JSX.Element {
  const { t } = useTranslation();
  
  // Custom Hook for API integrations
  const { users, isLoading, error, createMutation, updateMutation, deleteMutation } = useUsers();
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  // Screen View & Deletion States ('list' | 'create' | 'edit')
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingUser, setEditingUser] = useState<UserFormPayload | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Handlers
  const handleRoleToggle = (role: string) => {
    if (role === 'ALL') {
      setSelectedRoles([]);
      return;
    }
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleEditInit = (user: any) => {
    setEditingUser({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      dni: user.dni || '',
      birthDate: user.birthDate ? user.birthDate.substring(0, 10) : '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      postalCode: user.postalCode || '',
      country: user.country || 'ES',
      roles: Array.isArray(user.roles) ? user.roles : [user.role || 'STUDENT'],
      isActive: user.isActive ?? true,
      password: '',
    });
    setFormMode('edit');
  };

  const handleFormSubmit = (data: UserFormPayload) => {
    if (formMode === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => setFormMode('list'),
      });
    } else if (formMode === 'edit') {
      updateMutation.mutate(data, {
        onSuccess: () => {
          setFormMode('list');
          setEditingUser(null);
        },
      });
    }
  };

  if (isLoading) return <div className="p-6">{t('users.loading')}</div>;
  if (error) return <div className="p-6 text-destructive">{t('users.error')}</div>;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('users.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('users.subtitle')}</p>
        </div>
        {formMode === 'list' && (
          <Button onClick={() => setFormMode('create')} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t('users.new_user')}
          </Button>
        )}
      </div>

      {formMode !== 'list' ? (
        <UserForm
          initialData={formMode === 'edit' ? editingUser : null}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormMode('list');
            setEditingUser(null);
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      ) : (
        <>
          {/* Filter Controls */}
          <UserFilters 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            selectedRoles={selectedRoles} 
            onRoleToggle={handleRoleToggle} 
          />

          {/* Primary Data Display */}
          <UserTable 
            users={users}
            isLoading={isLoading}
            error={error}
            searchTerm={searchTerm}
            selectedRoles={selectedRoles}
            onEdit={handleEditInit}
            onDelete={setUserToDelete}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteUserModal 
        isOpen={!!userToDelete} 
        onClose={() => setUserToDelete(null)} 
        onConfirm={() => userToDelete && deleteMutation.mutate(userToDelete, {
          onSuccess: () => setUserToDelete(null)
        })} 
        isPending={deleteMutation.isPending} 
      />
    </div>
  );
}

export default Users;