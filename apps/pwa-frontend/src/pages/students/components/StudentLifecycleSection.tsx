/**
 * @file StudentLifecycleSection.tsx
 * @description Status + structured leave reason/channel when pausing or dropping a student.
 */

import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  isLeaveStatus,
  LEAVE_NOTICE_METHODS,
  LEAVE_REASONS,
  STUDENT_STATUSES,
} from '@/lib/domain-enums';
import type { LeaveFormValues } from '../lifecycle';

interface StudentLifecycleSectionProps {
  values: LeaveFormValues;
  errors: Record<string, string>;
  onChange: (field: keyof LeaveFormValues, value: string) => void;
}

/**
 * Academic lifecycle block for the student edit form.
 *
 * @param {StudentLifecycleSectionProps} props - Status/leave values and errors.
 * @returns {JSX.Element} Section.
 */
export function StudentLifecycleSection({ values, errors, onChange }: StudentLifecycleSectionProps) {
  const { t } = useTranslation();
  const showLeave = isLeaveStatus(values.status);

  return (
    <FormSection
      title={t('students.form.lifecycle_title')}
      description={t('students.form.lifecycle_help')}
    >
      <FormGrid>
        <Field id="student-status" label={t('students.form.status')} required>
          <Select
            id="student-status"
            value={values.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            {STUDENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`enums.status.${status}`)}
              </option>
            ))}
          </Select>
        </Field>
        {showLeave ? (
          <Field
            id="leaveReason"
            label={t('students.form.leave_reason')}
            required
            error={errors.leaveReason ? t(`students.form.${errors.leaveReason}`) : undefined}
          >
            <Select
              id="leaveReason"
              value={values.leaveReason}
              onChange={(event) => onChange('leaveReason', event.target.value)}
            >
              <option value="">{t('students.form.leave_reason_placeholder')}</option>
              {LEAVE_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {t(`enums.leave_reason.${reason}`)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        {showLeave ? (
          <Field
            id="leaveNoticeMethod"
            label={t('students.form.leave_notice')}
            required
            error={errors.leaveNoticeMethod ? t(`students.form.${errors.leaveNoticeMethod}`) : undefined}
          >
            <Select
              id="leaveNoticeMethod"
              value={values.leaveNoticeMethod}
              onChange={(event) => onChange('leaveNoticeMethod', event.target.value)}
            >
              <option value="">{t('students.form.leave_notice_placeholder')}</option>
              {LEAVE_NOTICE_METHODS.map((method) => (
                <option key={method} value={method}>
                  {t(`enums.leave_notice.${method}`)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        {showLeave ? (
          <Field
            id="customReasonDetails"
            label={t('students.form.custom_reason')}
            required={values.leaveReason === 'OTHER'}
            className="md:col-span-2"
            error={errors.customReasonDetails ? t(`students.form.${errors.customReasonDetails}`) : undefined}
          >
            <Textarea
              id="customReasonDetails"
              value={values.customReasonDetails}
              onChange={(event) => onChange('customReasonDetails', event.target.value)}
              placeholder={t('students.form.custom_reason_placeholder')}
            />
          </Field>
        ) : null}
      </FormGrid>
    </FormSection>
  );
}
