/**
 * @file UserTable.tsx
 * @description Presentational component rendering the complex expandable user table.
 * Handles internal sorting, row expansion, and complex data filtering.
 */

import { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  error: any;
  searchTerm: string;
  selectedRoles: string[];
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'ADMIN_STAFF': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'SPORTS_TECHNICAL_DIRECTOR': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'INSTRUCTOR': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'STUDENT': return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'PARENT': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function UserTable({ users, isLoading, error, searchTerm, selectedRoles, onEdit, onDelete }: UserTableProps): JSX.Element {
  const { t } = useTranslation();
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'firstName', direction: 'asc' });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getProcessedUsers = () => {
    if (!Array.isArray(users)) return [];

    const filtered = users.filter((u: any) => {
      const searchTarget = `${u.firstName} ${u.lastName} ${u.email} ${u.dni || ''} ${u.phone || ''}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
      const matchesRole = selectedRoles.length > 0 ? selectedRoles.includes(u.role) : true;
      return matchesSearch && matchesRole;
    });

    return filtered.sort((a: any, b: any) => {
      const { key, direction } = sortConfig;
      const dirMultiplier = direction === 'asc' ? 1 : -1;

      let valA = a[key] ?? '';
      let valB = b[key] ?? '';

      if (key === 'birthDate') {
        valA = a.birthDate ? new Date(a.birthDate).getTime() : 0;
        valB = b.birthDate ? new Date(b.birthDate).getTime() : 0;
      } else if (key === 'isActive') {
        valA = a.isActive ? 1 : 0;
        valB = b.isActive ? 1 : 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return -1 * dirMultiplier;
      if (valA > valB) return 1 * dirMultiplier;

      if (key === 'firstName') {
        const lastA = (a.lastName || '').toLowerCase();
        const lastB = (b.lastName || '').toLowerCase();
        if (lastA < lastB) return -1 * dirMultiplier;
        if (lastA > lastB) return 1 * dirMultiplier;
      }

      return 0;
    });
  };

  const processedUsers = getProcessedUsers();

  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{t(label)}</span>
        <span className="text-gray-400 group-hover:text-gray-600">
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  );

  if (isLoading) return <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">{t('users.loading')}</div>;
  if (error) return <div className="p-6 text-center text-red-600 bg-white rounded-lg shadow">{t('users.error')}</div>;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="users.table_name" sortKey="firstName" />
              <SortableHeader label="users.table_last_name" sortKey="lastName" />
              <SortableHeader label="users.table_email" sortKey="email" />
              <SortableHeader label="users.table_role" sortKey="role" />
              <SortableHeader label="users.table_birth_date" sortKey="birthDate" />
              <SortableHeader label="users.table_dni" sortKey="dni" />
              <SortableHeader label="users.table_status" sortKey="isActive" />
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('users.table_actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No hay usuarios encontrados.</td>
              </tr>
            ) : (
              processedUsers.map((user: any) => (
                <Fragment key={user.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedUserId === user.id ? 'bg-blue-50/50' : ''}`}
                    onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : <span className="text-gray-400 italic">{t('users.no_birth_date')}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dni || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(user); }}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 border-red-200" onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>

                  {expandedUserId === user.id && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-md shadow-inner border border-gray-100">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('users.phone')}</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">{user.phone || t('users.no_phone')}</p>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('users.address')}</h4>
                            <p className="text-sm text-gray-900">
                              {user.address ? (
                                <>
                                  {user.address}<br />
                                  {user.postalCode} {user.city}<br />
                                  {user.state}, {user.country}
                                </>
                              ) : (
                                <span className="text-gray-400 italic">No hay dirección registrada.</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}