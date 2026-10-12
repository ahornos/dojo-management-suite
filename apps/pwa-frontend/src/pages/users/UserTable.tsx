/**
 * @file UserTable.tsx
 * @description Presentational component rendering the complex expandable user table.
 * Handles internal sorting, row expansion, and multi-role filtering.
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

/**
 * Maps a role enum to semantic badge classes.
 *
 * @param {string} role - Stored role enum.
 * @returns {string} Tailwind class list for the badge.
 */
const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-belt-purple/15 text-foreground border-belt-purple/40';
    case 'ADMIN_STAFF': return 'bg-primary/15 text-primary border-primary/30';
    case 'SPORTS_TECHNICAL_DIRECTOR': return 'bg-secondary text-secondary-foreground border-border';
    case 'INSTRUCTOR': return 'bg-accent text-accent-foreground border-border';
    case 'STUDENT': return 'bg-muted text-muted-foreground border-border';
    case 'PARENT': return 'bg-warning/15 text-warning border-warning/40';
    default: return 'bg-muted text-foreground border-border';
  }
};

/**
 * Sortable, expandable users table with role badges and row actions.
 *
 * @param {UserTableProps} props - Users, filters, and edit/delete handlers.
 * @returns {JSX.Element} The users data table.
 */
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
      
      // Check if user roles array matches any selected filter role
      const userRoles = Array.isArray(u.roles) ? u.roles : [u.role || 'STUDENT'];
      const matchesRole = selectedRoles.length > 0 ? selectedRoles.some((r) => userRoles.includes(r)) : true;
      
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

      return 0;
    });
  };

  const processedUsers = getProcessedUsers();

  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted select-none group transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{t(label)}</span>
        <span className="text-muted-foreground group-hover:text-muted-foreground">
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  );

  if (isLoading) return <div className="p-6 text-center text-muted-foreground bg-card rounded-lg shadow">{t('users.loading')}</div>;
  if (error) return <div className="p-6 text-center text-destructive bg-card rounded-lg shadow">{t('users.error')}</div>;

  return (
    <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <SortableHeader label="users.table_name" sortKey="firstName" />
              <SortableHeader label="users.table_last_name" sortKey="lastName" />
              <SortableHeader label="users.table_email" sortKey="email" />
              <SortableHeader label="users.table_role" sortKey="roles" />
              <SortableHeader label="users.table_birth_date" sortKey="birthDate" />
              <SortableHeader label="users.table_dni" sortKey="dni" />
              <SortableHeader label="users.table_status" sortKey="isActive" />
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('users.table_actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {processedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-muted-foreground">{t('users.no_users')}</td>
              </tr>
            ) : (
              processedUsers.map((user: any) => {
                const userRoles = Array.isArray(user.roles) ? user.roles : [user.role || 'STUDENT'];
                return (
                  <Fragment key={user.id}>
                    <tr 
                      className={`hover:bg-muted cursor-pointer transition-colors ${expandedUserId === user.id ? 'bg-primary/10' : ''}`}
                      onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {userRoles.map((r: string) => (
                            <span key={r} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(r)}`}>
                              {t(`users.roles.${r}`)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : <span className="text-muted-foreground italic">{t('users.no_birth_date')}</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.dni || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'}`}>
                          {user.isActive ? t('users.active') : t('users.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(user); }}>
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive border-destructive/40" onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>

                    {expandedUserId === user.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-muted border-b border-border">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-card rounded-md shadow-inner border border-border">
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t('users.phone')}</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">{user.phone || t('users.no_phone')}</p>
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t('users.address')}</h4>
                              <p className="text-sm text-foreground">
                                {user.address ? (
                                  <>
                                    {user.address}<br />
                                    {user.postalCode} {user.city}<br />
                                    {user.state}, {user.country}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground italic">No hay dirección registrada.</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}