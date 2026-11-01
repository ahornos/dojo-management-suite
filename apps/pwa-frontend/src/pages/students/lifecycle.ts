/**
 * @file lifecycle.ts
 * @description Zod-backed validation for pause/drop leave metadata, matching UpdateStudentDto.
 */

import { z } from 'zod';
import { isLeaveStatus, LEAVE_NOTICE_METHODS, LEAVE_REASONS } from '@/lib/domain-enums';

export interface LeaveFormValues {
  status: string;
  leaveReason: string;
  leaveNoticeMethod: string;
  customReasonDetails: string;
}

export interface ParsedLeave {
  status: string;
  leaveReason?: string;
  leaveNoticeMethod?: string;
  customReasonDetails?: string;
  statusReason?: string;
}

/**
 * Validates leave fields when status is PAUSED or DROPPED.
 *
 * @param {LeaveFormValues} values - Status and leave selectors.
 * @returns {{ data?: ParsedLeave; errors: Record<string, string> }} Payload or i18n suffixes.
 */
export function parseLeaveFields(values: LeaveFormValues): { data?: ParsedLeave; errors: Record<string, string> } {
  if (!isLeaveStatus(values.status)) {
    return { data: { status: values.status }, errors: {} };
  }

  const schema = z
    .object({
      leaveReason: z.string(),
      leaveNoticeMethod: z.string(),
      customReasonDetails: z.string(),
    })
    .superRefine((value, ctx) => {
      if (!(LEAVE_REASONS as readonly string[]).includes(value.leaveReason)) {
        ctx.addIssue({ code: 'custom', path: ['leaveReason'], message: 'leave_reason_required' });
      }
      if (!(LEAVE_NOTICE_METHODS as readonly string[]).includes(value.leaveNoticeMethod)) {
        ctx.addIssue({
          code: 'custom',
          path: ['leaveNoticeMethod'],
          message: 'leave_notice_required',
        });
      }
      if (value.leaveReason === 'OTHER' && !value.customReasonDetails.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['customReasonDetails'],
          message: 'custom_reason_required',
        });
      }
    });

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!errors[key]) errors[key] = issue.message;
    }
    return { errors };
  }

  const details = values.customReasonDetails.trim();
  return {
    data: {
      status: values.status,
      leaveReason: values.leaveReason,
      leaveNoticeMethod: values.leaveNoticeMethod,
      customReasonDetails: details || undefined,
      statusReason: details || values.leaveReason,
    },
    errors: {},
  };
}
