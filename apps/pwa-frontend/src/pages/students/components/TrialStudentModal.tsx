/**
 * @file TrialStudentModal.tsx
 * @description Dialog for registering a TRIAL prospect. Contact fields switch between
 * adult (email/phone) and minor (guardian name/phone) based on the watched birth date.
 */

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateInput } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { translateApiError } from '@/lib/errors';
import { CreateTrialStudentPayload } from '../types';

interface DisciplineOption {
  id: string;
  name: string;
}

interface TrialStudentModalProps {
  isOpen: boolean;
  disciplines: DisciplineOption[];
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (payload: CreateTrialStudentPayload) => void;
}

const TRIAL_ADULT_AGE = 18;

/**
 * Computes whether a birth date corresponds to an adult prospect.
 *
 * @param {string | undefined} birthDate - ISO-8601 date string.
 * @returns {boolean | null} `true` adult, `false` minor, `null` when the date is missing/invalid.
 */
function adultFromBirthDate(birthDate: string | undefined): boolean | null {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= TRIAL_ADULT_AGE;
}

/**
 * Modal form for capturing a trial student and posting it through the parent mutation.
 *
 * @param {TrialStudentModalProps} props - Visibility, discipline options, mutation state, and handlers.
 * @returns {JSX.Element | null} The dialog, or `null` when closed.
 */
export function TrialStudentModal({
  isOpen,
  disciplines,
  isPending,
  error,
  onClose,
  onSubmit,
}: TrialStudentModalProps): JSX.Element | null {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z
        .object({
          disciplineId: z.string().min(1, t('students.trial.validation.discipline')),
          firstName: z.string().min(1, t('students.trial.validation.first_name')),
          lastName: z.string().min(1, t('students.trial.validation.last_name')),
          birthDate: z.string().min(1, t('students.trial.validation.birth_date')),
          email: z.string().optional(),
          phone: z.string().optional(),
          guardianName: z.string().optional(),
          guardianPhone: z.string().optional(),
        })
        .superRefine((values, ctx) => {
          const adult = adultFromBirthDate(values.birthDate);
          if (adult === true) {
            if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
              ctx.addIssue({ code: 'custom', path: ['email'], message: t('students.trial.validation.email') });
            }
            if (!values.phone?.trim()) {
              ctx.addIssue({ code: 'custom', path: ['phone'], message: t('students.trial.validation.phone') });
            }
          }
          if (adult === false) {
            if (!values.guardianName?.trim()) {
              ctx.addIssue({ code: 'custom', path: ['guardianName'], message: t('students.trial.validation.guardian_name') });
            }
            if (!values.guardianPhone?.trim()) {
              ctx.addIssue({ code: 'custom', path: ['guardianPhone'], message: t('students.trial.validation.guardian_phone') });
            }
          }
        }),
    [t],
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTrialStudentPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      disciplineId: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      phone: '',
      guardianName: '',
      guardianPhone: '',
    },
  });

  const birthDate = watch('birthDate');
  const isAdult = adultFromBirthDate(birthDate);

  if (!isOpen) {
    return null;
  }

  /**
   * Closes the dialog and restores empty defaults.
   *
   * @returns {void}
   */
  const handleClose = (): void => {
    reset();
    onClose();
  };

  /**
   * Submits only the contact fields that apply to the computed age.
   *
   * @param {CreateTrialStudentPayload} values - Validated form values.
   * @returns {void}
   */
  const submit = (values: CreateTrialStudentPayload): void => {
    const adult = adultFromBirthDate(values.birthDate);
    onSubmit({
      disciplineId: values.disciplineId,
      firstName: values.firstName,
      lastName: values.lastName,
      birthDate: values.birthDate,
      ...(adult
        ? { email: values.email, phone: values.phone }
        : { guardianName: values.guardianName, guardianPhone: values.guardianPhone }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
      <Card className="my-8 w-full max-w-lg bg-card shadow-xl">
        <CardHeader>
          <CardTitle className="text-foreground">{t('students.trial.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(submit)}>
            <FormSection title={t('students.trial.title')}>
              <FormGrid>
                <Field
                  id="trial-discipline"
                  label={t('students.trial.discipline')}
                  required
                  className="md:col-span-2"
                  error={errors.disciplineId?.message}
                >
                  <Select id="trial-discipline" {...register('disciplineId')}>
                    <option value="">{t('students.trial.discipline_placeholder')}</option>
                    {disciplines.map((discipline) => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field id="trial-firstName" label={t('students.trial.first_name')} required error={errors.firstName?.message}>
                  <Input id="trial-firstName" {...register('firstName')} />
                </Field>
                <Field id="trial-lastName" label={t('students.trial.last_name')} required error={errors.lastName?.message}>
                  <Input id="trial-lastName" {...register('lastName')} />
                </Field>
                <Field
                  id="trial-birthDate"
                  label={t('students.trial.birth_date')}
                  required
                  className="md:col-span-2"
                  error={errors.birthDate?.message}
                  hint={isAdult === null ? t('students.trial.age_hint') : undefined}
                >
                  <DateInput id="trial-birthDate" {...register('birthDate')} />
                </Field>
                {isAdult === true ? (
                  <>
                    <Field id="trial-email" label={t('students.trial.email')} required error={errors.email?.message}>
                      <Input id="trial-email" type="email" {...register('email')} />
                    </Field>
                    <Field id="trial-phone" label={t('students.trial.phone')} required error={errors.phone?.message}>
                      <Input id="trial-phone" type="tel" {...register('phone')} />
                    </Field>
                  </>
                ) : null}
                {isAdult === false ? (
                  <>
                    <Field
                      id="trial-guardianName"
                      label={t('students.trial.guardian_name')}
                      required
                      error={errors.guardianName?.message}
                    >
                      <Input id="trial-guardianName" {...register('guardianName')} />
                    </Field>
                    <Field
                      id="trial-guardianPhone"
                      label={t('students.trial.guardian_phone')}
                      required
                      error={errors.guardianPhone?.message}
                    >
                      <Input id="trial-guardianPhone" type="tel" {...register('guardianPhone')} />
                    </Field>
                  </>
                ) : null}
              </FormGrid>
            </FormSection>

            {error ? (
              <p className="text-sm text-destructive">{translateApiError(t, error, 'students.trial.error')}</p>
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                {t('students.trial.cancel')}
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground">
                {isPending ? t('students.trial.saving') : t('students.trial.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
