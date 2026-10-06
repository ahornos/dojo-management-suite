/**
 * @file GuardianSection.tsx
 * @description Renders the parent/guardian information form required for minor students.
 */

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuardianSectionProps {
  parentData: any;
  onChange: (field: string, value: string) => void;
  isMinor: boolean;
}

export function GuardianSection({ parentData, onChange, isMinor }: GuardianSectionProps) {
  const { t } = useTranslation();

  if (!isMinor) return null;

  return (
    <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
        <h3 className="text-lg font-bold text-amber-900">{t('students.form.guardian_title')}</h3>
        <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
          {t('students.form.guardian_required_badge')}
        </span>
      </div>
      <p className="text-sm text-amber-800">
        {t('students.form.guardian_help')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pFirstName" className="text-amber-900">{t('students.form.guardian_first_name')}</Label>
          <Input id="pFirstName" required={isMinor} value={parentData.firstName} onChange={(e) => onChange('firstName', e.target.value)} className="border-amber-300 focus:ring-amber-500 bg-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pLastName" className="text-amber-900">{t('students.form.guardian_last_name')}</Label>
          <Input id="pLastName" required={isMinor} value={parentData.lastName} onChange={(e) => onChange('lastName', e.target.value)} className="border-amber-300 focus:ring-amber-500 bg-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pEmail" className="text-amber-900">{t('students.form.guardian_email')}</Label>
          <Input id="pEmail" type="email" required={isMinor} value={parentData.email} onChange={(e) => onChange('email', e.target.value)} className="border-amber-300 focus:ring-amber-500 bg-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pPhone" className="text-amber-900">{t('students.form.guardian_phone')}</Label>
          <Input id="pPhone" type="tel" required={isMinor} value={parentData.phone} onChange={(e) => onChange('phone', e.target.value)} className="border-amber-300 focus:ring-amber-500 bg-white" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pDni" className="text-amber-900">{t('students.form.guardian_dni')}</Label>
          <Input id="pDni" required={isMinor} value={parentData.dni} onChange={(e) => onChange('dni', e.target.value)} className="border-amber-300 focus:ring-amber-500 bg-white" />
        </div>
      </div>
    </div>
  );
}