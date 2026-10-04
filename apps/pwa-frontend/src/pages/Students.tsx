/**
 * @file Students.tsx
 * @description Students module view. Handles fetching, displaying, and creating student records.
 * Includes resilient data parsing to prevent array mapping crashes and a comprehensive 
 * creation form aligned with the backend DTO.
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
 * Interface representing a Student entity received from the backend.
 * @interface
 */
interface StudentResponse {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Interface representing the payload required to create a new student.
 * @interface
 */
interface CreateStudentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function Students() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState<CreateStudentPayload>({ 
    firstName: '', 
    lastName: '', 
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'ES',
  });

  const { data: students = [], isLoading, isError } = useQuery<StudentResponse[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await apiClient.get('/students');
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return responseData;
      }
      if (responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      if (responseData && Array.isArray(responseData.items)) {
        return responseData.items;
      }
      
      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newStudent: CreateStudentPayload) => {
      const response = await apiClient.post('/students', newStudent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsCreating(false);
      setFormData({ 
        firstName: '', lastName: '', email: '', phone: '', 
        address: '', city: '', state: '', postalCode: '', country: 'ES' 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-6">{t('students.loading')}</div>;
  if (isError) return <div className="p-6 text-red-500">{t('students.error')}</div>;

  const safeStudents = Array.isArray(students) ? students : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('students.title')}</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            {t('students.new_student')}
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>{t('students.create_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('students.first_name')}</Label>
                  <Input id="firstName" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('students.last_name')}</Label>
                  <Input id="lastName" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('students.email')}</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('students.phone')}</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('students.address_section')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('students.address')}</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">{t('students.city')}</Label>
                    <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t('students.postal_code')}</Label>
                    <Input id="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{t('students.country')}</Label>
                    <Input id="country" maxLength={2} value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  {t('students.cancel')}
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? t('students.saving') : t('students.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('students.first_name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('students.email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('users.table_status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">{t('students.no_students')}</td>
                </tr>
              ) : (
                safeStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {student.user?.firstName} {student.user?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{student.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t('students.active')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}