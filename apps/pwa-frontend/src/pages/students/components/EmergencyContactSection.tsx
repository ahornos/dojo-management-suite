/**
 * @file EmergencyContactSection.tsx
 * @description Lightweight array manager for adult emergency contacts.
 * Bypasses the heavy Guardian/User requirement, storing pure JSON text payload.
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { EmergencyContactPayload } from '../types';

interface EmergencyContactSectionProps {
  contacts: EmergencyContactPayload[];
  onChange: (contacts: EmergencyContactPayload[]) => void;
  isMinor: boolean;
}

const RELATIONSHIP_OPTIONS = ['Padre', 'Madre', 'Hermano/a', 'Pareja', 'Amigo/a', 'Otro'];

export function EmergencyContactSection({ contacts, onChange, isMinor }: EmergencyContactSectionProps) {
  if (isMinor) return null;

  const handleAdd = () => onChange([...contacts, { name: '', phone: '', relationship: 'Familiar' }]);
  
  const handleUpdate = (idx: number, field: string, value: string) => {
    const updated = [...contacts];
    (updated[idx] as any)[field] = value;
    onChange(updated);
  };
  
  const handleRemove = (idx: number) => onChange(contacts.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Contactos de Emergencia</h3>
          <p className="text-sm text-gray-500 mt-1">Opcional. Añade a quién avisar en caso de emergencia.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="gap-2">
          <PlusCircle className="w-4 h-4" /> Añadir Contacto
        </Button>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, idx) => (
          <div key={idx} className="p-4 border border-gray-200 bg-gray-50/50 rounded-xl space-y-4">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Contacto {idx + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8" onClick={() => handleRemove(idx)}>
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nombre y Apellidos</Label>
                <Input value={contact.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} required placeholder="Ej. Carlos López" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={contact.phone} onChange={(e) => handleUpdate(idx, 'phone', e.target.value)} required placeholder="Ej. +34 600 000 000" />
              </div>
              <div className="space-y-2">
                <Label>Relación</Label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={contact.relationship === 'Otro' || !RELATIONSHIP_OPTIONS.includes(contact.relationship) ? 'Otro' : contact.relationship}
                    onChange={(e) => {
                      if (e.target.value === 'Otro') {
                        handleUpdate(idx, 'relationship', 'Otro');
                        handleUpdate(idx, 'customRelationship', '');
                      } else {
                        handleUpdate(idx, 'relationship', e.target.value);
                      }
                    }}
                  >
                    {RELATIONSHIP_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              {(contact.relationship === 'Otro' || !RELATIONSHIP_OPTIONS.includes(contact.relationship)) && (
                <div className="space-y-2 md:col-span-3">
                  <Label>Especificar Relación</Label>
                  <Input 
                    value={contact.customRelationship !== undefined ? contact.customRelationship : contact.relationship} 
                    onChange={(e) => { handleUpdate(idx, 'customRelationship', e.target.value); handleUpdate(idx, 'relationship', e.target.value); }} 
                    placeholder="Ej. Abuela" required 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}