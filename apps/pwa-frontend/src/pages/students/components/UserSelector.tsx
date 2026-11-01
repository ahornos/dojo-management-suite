/**
 * @file UserSelector.tsx
 * @description Component for toggling and selecting existing system users
 * to be enrolled as students.
 */

import { useTranslation } from 'react-i18next';
import { Field, FormSection } from '@/components/forms/FormSection';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface UserSelectorProps {
  isExistingUser: boolean;
  onToggleExisting: (checked: boolean) => void;
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  availableUsers: any[];
}

/**
 * Enrollment identity toggle: create a new user or attach an existing directory account.
 *
 * @param {UserSelectorProps} props - Toggle state, selected id, lookup users, and handlers.
 * @returns {JSX.Element} Section.
 */
export function UserSelector({
  isExistingUser,
  onToggleExisting,
  selectedUserId,
  onSelectUser,
  availableUsers,
}: UserSelectorProps) {
  const { t } = useTranslation();

  return (
    <FormSection title={t('students.form.enrollment_title')}>
      <div className="flex w-max items-center gap-3 rounded-lg border border-border bg-card px-4 py-2 shadow-sm">
        <Label htmlFor="user-toggle" className="cursor-pointer text-sm font-medium text-foreground">
          {t('students.form.existing_user_toggle')}
        </Label>
        <Switch id="user-toggle" checked={isExistingUser} onCheckedChange={onToggleExisting} />
      </div>

      {isExistingUser ? (
        <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/10 p-4">
          <Field
            id="userSelect"
            label={t('students.form.select_user_title')}
            required
            hint={t('students.form.select_user_help')}
          >
            <Select
              id="userSelect"
              required={isExistingUser}
              value={selectedUserId}
              onChange={(e) => onSelectUser(e.target.value)}
            >
              <option value="">{t('students.form.select_user_placeholder')}</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </Select>
          </Field>
        </div>
      ) : null}
    </FormSection>
  );
}
