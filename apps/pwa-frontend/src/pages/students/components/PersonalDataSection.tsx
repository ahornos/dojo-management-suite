/**
 * @file PersonalDataSection.tsx
 * @description Renders the core personal information fields for a student, 
 * including full address, state/province, and country details.
 */

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalDataSectionProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  isMinor: boolean;
}

export function PersonalDataSection({ formData, onChange, isMinor }: PersonalDataSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        {t('students.form.personal_data_title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('users.first_name')} *</Label>
          <Input id="firstName" required value={formData.firstName} onChange={(e) => onChange('firstName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t('users.last_name')} *</Label>
          <Input id="lastName" required value={formData.lastName} onChange={(e) => onChange('lastName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('users.email')} *</Label>
          <Input id="email" type="email" required value={formData.email} onChange={(e) => onChange('email', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dni">{t('users.dni')}</Label>
          <Input id="dni" value={formData.dni} onChange={(e) => onChange('dni', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-blue-700 font-semibold">{t('users.birth_date')} *</Label>
          <Input 
            id="birthDate" 
            type="date" 
            required 
            value={formData.birthDate} 
            onChange={(e) => onChange('birthDate', e.target.value)} 
            className={isMinor ? 'border-amber-400 focus:ring-amber-500 bg-amber-50/30' : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('users.phone')}</Label>
          <Input id="phone" type="tel" value={formData.phone} onChange={(e) => onChange('phone', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">{t('users.address')}</Label>
          <Input id="address" value={formData.address} onChange={(e) => onChange('address', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">{t('users.city')}</Label>
          <Input id="city" value={formData.city} onChange={(e) => onChange('city', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">{t('users.postal_code')}</Label>
          <Input id="postalCode" value={formData.postalCode} onChange={(e) => onChange('postalCode', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="state">{t('users.state')}</Label>
          <Input id="state" value={formData.state || ''} onChange={(e) => onChange('state', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t('users.country')}</Label>
          <Input id="country" maxLength={2} value={formData.country || 'ES'} onChange={(e) => onChange('country', e.target.value.toUpperCase())} />
        </div>
      </div>
    </div>
  );
}