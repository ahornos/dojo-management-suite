/**
 * @file UnlinkContactModal.tsx
 * @description Confirmation modal for unlinking a guardian or emergency contact from a student.
 * Clarifies that the user account itself will not be deleted, only the relationship.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface UnlinkContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnlinkContactModal({ isOpen, onClose, onConfirm }: UnlinkContactModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-white shadow-xl border-orange-200">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-gray-800 text-lg">Desligar Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            ¿Estás seguro de que deseas desligar a este contacto del estudiante? 
            <br/><br/>
            <strong>Nota:</strong> El usuario <u>no será eliminado</u> del sistema, simplemente dejará de aparecer como contacto de emergencia o tutor de este alumno.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={onConfirm}>
              Desligar Contacto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}