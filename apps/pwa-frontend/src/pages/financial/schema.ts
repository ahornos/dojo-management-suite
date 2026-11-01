/**
 * @file schema.ts
 * @description Zod schema for the academy financial configuration form.
 * Issue messages are i18n key suffixes under `financial.config.*`.
 */

import { z } from 'zod';
import { isValidIban, toIban } from '@/lib/iban';

/**
 * Builds the configuration schema. IBAN is optional until filled; then checksum is required.
 *
 * @returns {z.ZodObject} Schema for react-hook-form.
 */
export function financialConfigSchema() {
  return z.object({
    legalName: z.string(),
    taxId: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string().length(2, 'country_invalid'),
    creditorId: z.string(),
    iban: z.string().superRefine((value, ctx) => {
      const compact = toIban(value);
      if (!compact) return;
      if (!isValidIban(compact)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'iban_invalid' });
      }
    }),
    bic: z.string(),
  });
}

export type FinancialConfigFormValues = z.infer<ReturnType<typeof financialConfigSchema>>;
