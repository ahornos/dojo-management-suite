/**
 * @file UserSelector.tsx
 * @description Component for toggling and selecting existing system users 
 * to be enrolled as students.
 */

import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface UserSelectorProps {
  isExistingUser: boolean;
  onToggleExisting: (checked: boolean) => void;
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  availableUsers: any[];
}

export function UserSelector({ 
  isExistingUser, 
  onToggleExisting, 
  selectedUserId, 
  onSelectUser, 
  availableUsers 
}: UserSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg shadow-sm border border-border w-max">
        <Label htmlFor="user-toggle" className="text-sm font-medium text-foreground cursor-pointer">
          {t('students.form.existing_user_toggle')}
        </Label>
        <Switch
          id="user-toggle"
          checked={isExistingUser}
          onCheckedChange={onToggleExisting}
        />
      </div>

      {isExistingUser && (
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 space-y-2 animate-in fade-in">
          <Label htmlFor="userSelect" className="text-primary font-semibold">
            {t('students.form.select_user_title')}
          </Label>
          <select
            id="userSelect"
            required={isExistingUser}
            value={selectedUserId}
            onChange={(e) => onSelectUser(e.target.value)}
            className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-ring focus:outline-none bg-card text-sm"
          >
            <option value="">{t('students.form.select_user_placeholder')}</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.email}) - {user.dni || t('users.no_dni')}
              </option>
            ))}
          </select>
          <p className="text-xs text-primary">
            {t('students.form.select_user_help')}
          </p>
        </div>
      )}
    </div>
  );
}