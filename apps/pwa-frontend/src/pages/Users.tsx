/**
 * @file Users.tsx
 * @description Administrative dashboard view for managing system users, 
 * full postal address details, roles, account statuses, creation, and password resetting.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Interface representing the user creation and editing payload.
 * @interface
 */
interface UserFormPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  dni: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  role: string;
  isActive: boolean;
}

/**
 * Renders the user management view allowing administrators to list, 
 * search, create, and edit full personal profiles, addresses, and access credentials.
 * 
 * @component
 * @returns {React.ReactElement} The rendered Users management page.
 */
export function Users(): JSX.Element {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // State for modals
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserFormPayload | null>(null);

  const emptyFormState: UserFormPayload = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'ES',
    role: 'STUDENT',
    isActive: true,
  };

  const [newUser, setNewUser] = useState<UserFormPayload>(emptyFormState);

  // Fetch users query
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/users');
      return response.data;
    },
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: async (payload: UserFormPayload) => {
      const response = await apiClient.post('/auth/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreating(false);
      setNewUser(emptyFormState);
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: UserFormPayload) => {
      const { id, ...data } = payload;
      // Omit password if left blank by the admin during an update
      if (!data.password || data.password.trim() === '') {
        delete data.password;
      }
      const response = await apiClient.patch(`/auth/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
    },
  });

  const handleEditClick = (user: any) => {
    setEditingUser({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      dni: user.dni || '',
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newUser);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate(editingUser);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((u: any) =>
        `${u.firstName} ${u.lastName} ${u.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('users.title')}</h1>
          <p className="text-sm text-gray-500">{t('users.subtitle')}</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          {t('users.new_user')}
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Input
          placeholder={t('users.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {isLoading && <div className="p-6 text-center text-gray-500">{t('users.loading')}</div>}
        {error && <div className="p-6 text-center text-red-600">{t('users.error')}</div>}
        
        {!isLoading && !error && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_role')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_dni_phone')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_status')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No hay usuarios encontrados.</td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{user.dni || t('users.no_dni')}</div>
                      <div className="text-xs text-gray-400">{user.phone || t('users.no_phone')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                        {t('users.edit')}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white shadow-xl my-8">
            <CardHeader>
              <CardTitle>{t('users.create_modal_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-firstName">{t('users.first_name')}</Label>
                    <Input
                      id="create-firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-lastName">{t('users.last_name')}</Label>
                    <Input
                      id="create-lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-email">{t('users.email')}</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-password">{t('users.password')}</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500">{t('users.password_hint')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-dni">{t('users.dni')}</Label>
                    <Input
                      id="create-dni"
                      value={newUser.dni}
                      onChange={(e) => setNewUser({ ...newUser, dni: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-phone">{t('users.phone')}</Label>
                    <Input
                      id="create-phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-role">{t('users.role')}</Label>
                    <select
                      id="create-role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN_STAFF">ADMIN_STAFF</option>
                      <option value="SPORTS_TECHNICAL_DIRECTOR">SPORTS_TECHNICAL_DIRECTOR</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="PARENT">PARENT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-status">{t('users.status_label')}</Label>
                    <select
                      id="create-status"
                      value={newUser.isActive ? 'true' : 'false'}
                      onChange={(e) => setNewUser({ ...newUser, isActive: e.target.value === 'true' })}
                      className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">{t('users.active')}</option>
                      <option value="false">{t('users.inactive')}</option>
                    </select>
                  </div>
                </div>

                {/* Postal Address Section */}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">{t('users.address_section')}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="create-address">{t('users.address')}</Label>
                    <Input
                      id="create-address"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="create-city">{t('users.city')}</Label>
                      <Input
                        id="create-city"
                        value={newUser.city}
                        onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-state">{t('users.state')}</Label>
                      <Input
                        id="create-state"
                        value={newUser.state}
                        onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-postalCode">{t('users.postal_code')}</Label>
                      <Input
                        id="create-postalCode"
                        value={newUser.postalCode}
                        onChange={(e) => setNewUser({ ...newUser, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 w-1/2 pr-2">
                    <Label htmlFor="create-country">{t('users.country')}</Label>
                    <Input
                      id="create-country"
                      maxLength={2}
                      value={newUser.country}
                      onChange={(e) => setNewUser({ ...newUser, country: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    {t('users.cancel')}
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? t('users.saving') : t('users.save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white shadow-xl my-8">
            <CardHeader>
              <CardTitle>{t('users.edit_modal_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-firstName">{t('users.first_name')}</Label>
                    <Input
                      id="edit-firstName"
                      value={editingUser.firstName}
                      onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-lastName">{t('users.last_name')}</Label>
                    <Input
                      id="edit-lastName"
                      value={editingUser.lastName}
                      onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="edit-email">{t('users.email')}</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-dni">{t('users.dni')}</Label>
                    <Input
                      id="edit-dni"
                      value={editingUser.dni}
                      onChange={(e) => setEditingUser({ ...editingUser, dni: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">{t('users.phone')}</Label>
                    <Input
                      id="edit-phone"
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">{t('users.role')}</Label>
                    <select
                      id="edit-role"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN_STAFF">ADMIN_STAFF</option>
                      <option value="SPORTS_TECHNICAL_DIRECTOR">SPORTS_TECHNICAL_DIRECTOR</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="PARENT">PARENT</option>
                    </select>
                  </div>
                </div>

                {/* Postal Address Section */}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">{t('users.address_section')}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">{t('users.address')}</Label>
                    <Input
                      id="edit-address"
                      value={editingUser.address}
                      onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-city">{t('users.city')}</Label>
                      <Input
                        id="edit-city"
                        value={editingUser.city}
                        onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-state">{t('users.state')}</Label>
                      <Input
                        id="edit-state"
                        value={editingUser.state}
                        onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-postalCode">{t('users.postal_code')}</Label>
                      <Input
                        id="edit-postalCode"
                        value={editingUser.postalCode}
                        onChange={(e) => setEditingUser({ ...editingUser, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-country">{t('users.country')}</Label>
                      <Input
                        id="edit-country"
                        maxLength={2}
                        value={editingUser.country}
                        onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">{t('users.status_label')}</Label>
                      <select
                        id="edit-status"
                        value={editingUser.isActive ? 'true' : 'false'}
                        onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'true' })}
                        className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">{t('users.active')}</option>
                        <option value="false">{t('users.inactive')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password Security Section */}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">{t('users.password_section')}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="edit-password">{t('users.password')}</Label>
                    <Input
                      id="edit-password"
                      type="password"
                      placeholder="••••••••"
                      value={editingUser.password || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">{t('users.password_hint')}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    {t('users.cancel')}
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? t('users.saving') : t('users.save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Users;