/**
 * @file Users.tsx
 * @description Administrative dashboard view orchestrator.
 * Acts as the controller uniting network state (useUsers hook), filter controls,
 * the interactive data table, and modal interactions.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { UserFormPayload } from './types';
import { useUsers } from './useUsers';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { DeleteUserModal } from './DeleteUserModal';

export function Users(): JSX.Element {
  const { t } = useTranslation();
  
  // Custom Hook for API integrations
  const { users, isLoading, error, createMutation, updateMutation, deleteMutation } = useUsers();
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  // Modal Management States
  const [isCreating, setIsCreating] = useState<boolean>(false);
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
      role: user.role || 'STUDENT',
      isActive: user.isActive ?? true,
      password: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('users.title')}</h1>
          <p className="text-sm text-gray-500">{t('users.subtitle')}</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          {t('users.new_user')}
        </Button>
      </div>

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

      {/* Interactive Modals */}
      <CreateUserModal 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        onSubmit={(data) => {
          createMutation.mutate(data);
          setIsCreating(false);
        }} 
        isPending={createMutation.isPending} 
      />
      
      <EditUserModal 
        user={editingUser} 
        onClose={() => setEditingUser(null)} 
        onSubmit={(data) => {
          updateMutation.mutate(data);
          setEditingUser(null);
        }} 
        isPending={updateMutation.isPending} 
      />
      
      <DeleteUserModal 
        isOpen={!!userToDelete} 
        onClose={() => setUserToDelete(null)} 
        onConfirm={() => userToDelete && deleteMutation.mutate(userToDelete)} 
        isPending={deleteMutation.isPending} 
      />
    </div>
  );
}

export default Users;