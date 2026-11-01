/**
 * @file banking.ts
 * @description Zod schema and helpers for SEPA banking details on student onboarding.
 * Holder name, national ID and IBAN are required when the student is created as ACTIVE.
 */

import { z } from 'zod';
import { compactIban, isValidIban, toIban } from '@/lib/iban';

export { compactIban, isValidIban, toIban };

/**
 * Client-side SEPA debit details collected during student onboarding.
 */
export interface BankingDetails {
  accountHolderName: string;
  accountHolderDni: string;
  iban: string;
}

/**
 * Compact Spanish national ID: strip whitespace and uppercase.
 *
 * @param {string} dni - Raw DNI/NIF/NIE.
 * @returns {string} Normalized identifier.
 */
export function compactDni(dni: string): string {
  return dni.replace(/\s+/g, '').toUpperCase();
}

/**
 * Builds a Zod schema for SEPA banking fields.
 *
 * @param {boolean} required - When true (ACTIVE onboarding), all fields are mandatory.
 * @returns {z.ZodType<BankingDetails>} Schema whose issue `message` values are i18n key suffixes.
 */
export function bankingDetailsSchema(required: boolean) {
  return z
    .object({
      accountHolderName: z.string(),
      accountHolderDni: z.string(),
      iban: z.string(),
    })
    .superRefine((value, ctx) => {
      const name = value.accountHolderName.trim();
      const dni = compactDni(value.accountHolderDni);
      const iban = toIban(value.iban);
      const anyFilled = name.length > 0 || dni.length > 0 || iban.length > 0;
      if (!required && !anyFilled) return;

      if (!name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['accountHolderName'],
          message: 'account_holder_required',
        });
      }
      if (!dni) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['accountHolderDni'],
          message: 'account_holder_dni_required',
        });
      }
      if (!iban) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['iban'],
          message: 'iban_required',
        });
      } else if (!isValidIban(iban)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['iban'],
          message: 'iban_invalid',
        });
      }
    });
}

/**
 * Validates banking details and clickwrap consent, returning normalized values or i18n suffixes.
 *
 * @param {BankingDetails} values - Raw form values.
 * @param {boolean} required - Whether empty values are rejected.
 * @param {boolean} sepaAccepted - Whether the on-form SEPA clickwrap checkbox is ticked.
 * @returns {{ data?: BankingDetails; errors: Record<string, string> }} Normalized payload or field errors.
 */
export function parseBankingDetails(
  values: BankingDetails,
  required: boolean,
  sepaAccepted: boolean,
): { data?: BankingDetails; errors: Record<string, string> } {
  const parsed = bankingDetailsSchema(required).safeParse(values);
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!errors[key]) errors[key] = issue.message;
    }
  }

  const name = values.accountHolderName.trim();
  const dni = compactDni(values.accountHolderDni);
  const iban = toIban(values.iban);
  const anyFilled = name.length > 0 || dni.length > 0 || iban.length > 0;
  if ((required || anyFilled) && !sepaAccepted) {
    errors.sepaAccepted = 'sepa_accept_required';
  }

  if (Object.keys(errors).length > 0) return { errors };
  if (!name && !dni && !iban) return { errors: {} };

  return { data: { accountHolderName: name, accountHolderDni: dni, iban }, errors: {} };
}
