/**
 * @file GuardianSection.tsx
 * @description Component rendering the forms for managing one or multiple legal guardians for minors.
 * Handles existing user lookups, dynamic relationship types, and unlinking.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, UserCircle } from 'lucide-react';
import { UnlinkGuardianModal } from './UnlinkGuardianModal';

interface GuardianData {
  isExistingUser: boolean;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  relationship?: string;
  customRelationship?: string; 
}

interface GuardianSectionProps {
  guardians: GuardianData[];
  onChange: (idx: number, field: string, val: any) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onToggleExisting: (idx: number, checked: boolean) => void;
  onSelectUser: (idx: number, userId: string) => void;
  availableUsers: any[];
  isMinor: boolean;
}

const RELATIONSHIP_OPTIONS = [
  { value: 'Padre', label: 'Padre' },
  { value: 'Madre', label: 'Madre' },
  { value: 'Tutor Legal', label: 'Tutor Legal' },
  { value: 'Familiar', label: 'Familiar' },
  { value: 'Otro', label: 'Otro (Especificar)' },
];

export function GuardianSection({ 
  guardians, 
  onChange, 
  onAdd, 
  onRemove, 
  onToggleExisting, 
  onSelectUser, 
  availableUsers, 
  isMinor 
}: GuardianSectionProps) {
  const { t } = useTranslation();
  const [unlinkIdx, setUnlinkIdx] = useState<number | null>(null);

  if (!isMinor) return null;

  const handleRelationshipChange = (idx: number, value: string) => {
    if (value === 'Otro') {
      onChange(idx, 'relationship', 'Otro');
      onChange(idx, 'customRelationship', '');
    } else {
      onChange(idx, 'relationship', value);
      onChange(idx, 'customRelationship', undefined);
    }
  };

  const confirmRemove = () => {
    if (unlinkIdx !== null) {
      onRemove(unlinkIdx);
      setUnlinkIdx(null);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Tutores Legales</h3>
          <p className="text-sm text-gray-500 mt-1">Obligatorio para menores. Puedes añadir varios tutores.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Añadir Tutor
        </Button>
      </div>

      <div className="space-y-4">
        {guardians.map((guardian, idx) => {
          const isAlreadyLinked = Boolean(guardian.userId && guardian.userId.length > 0);

          return (
            <div key={idx} className="p-5 border border-blue-100 bg-blue-50/30 rounded-xl space-y-4 relative">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-blue-100/50">
                <span className="font-semibold text-blue-800">Tutor {idx + 1}</span>
                {guardians.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                    onClick={() => setUnlinkIdx(idx)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desligar
                  </Button>
                )}
              </div>

              {!isAlreadyLinked ? (
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
                  <Switch
                    checked={guardian.isExistingUser}
                    onCheckedChange={(c) => onToggleExisting(idx, c)}
                    id={`existing-guardian-${idx}`}
                  />
                  <Label htmlFor={`existing-guardian-${idx}`} className="text-sm cursor-pointer">
                    Vincular un usuario ya existente en el sistema
                  </Label>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-md border border-gray-200 w-fit">
                  <UserCircle className="w-4 h-4 text-blue-500" />
                  <span>Usuario vinculado (ID: <span className="font-mono text-gray-900">{guardian.userId?.slice(0, 8)}...</span>)</span>
                </div>
              )}

              {guardian.isExistingUser && !isAlreadyLinked && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Buscar Usuario</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={guardian.userId || ''}
                      onChange={(e) => onSelectUser(idx, e.target.value)}
                    >
                      <option value="">Selecciona un usuario...</option>
                      {availableUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Figura (Relación)</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={guardian.relationship === 'Otro' || (guardian.relationship && !RELATIONSHIP_OPTIONS.find(o => o.value === guardian.relationship)) ? 'Otro' : guardian.relationship || ''}
                    onChange={(e) => handleRelationshipChange(idx, e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecciona la figura...</option>
                    {RELATIONSHIP_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {(guardian.relationship === 'Otro' || (guardian.relationship && !RELATIONSHIP_OPTIONS.find(o => o.value === guardian.relationship))) && (
                  <div className="space-y-2">
                    <Label>Especificar Figura</Label>
                    <Input 
                      value={guardian.customRelationship !== undefined ? guardian.customRelationship : guardian.relationship} 
                      onChange={(e) => {
                        onChange(idx, 'customRelationship', e.target.value);
                        onChange(idx, 'relationship', e.target.value);
                      }} 
                      placeholder="Ej. Abuela"
                      required 
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('students.first_name')}</Label>
                  <Input value={guardian.firstName} onChange={(e) => onChange(idx, 'firstName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('students.last_name')}</Label>
                  <Input value={guardian.lastName} onChange={(e) => onChange(idx, 'lastName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('students.email')}</Label>
                  <Input type="email" value={guardian.email} onChange={(e) => onChange(idx, 'email', e.target.value)} required disabled={isAlreadyLinked} />
                </div>
                <div className="space-y-2">
                  <Label>{t('students.phone')}</Label>
                  <Input value={guardian.phone} onChange={(e) => onChange(idx, 'phone', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('students.dni')}</Label>
                  <Input value={guardian.dni} onChange={(e) => onChange(idx, 'dni', e.target.value)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <UnlinkGuardianModal 
        isOpen={unlinkIdx !== null} 
        onClose={() => setUnlinkIdx(null)} 
        onConfirm={confirmRemove} 
      />
    </div>
  );
}