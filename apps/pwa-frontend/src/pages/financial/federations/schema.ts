/**
 * @file schema.ts
 * @description Zod schema for the federation identity + seasonal pricing wizard.
 */

import { z } from 'zod';
import { FEDERATION_CONTACT_MEDIA, FEDERATION_CURRENCIES, LICENSE_PRICE_ROW_KINDS } from '@/lib/domain-enums';

const MONEY = /^\d{1,8}(\.\d{1,2})?$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Optional money field: blank is allowed (backend stores `0.00`); otherwise two decimals.
 */
const moneyField = z.string().superRefine((value, ctx) => {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (!MONEY.test(trimmed)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'amount_invalid' });
  }
});

/**
 * @returns {z.ZodObject} Schema for the federation catalog form.
 */
export function federationSchema() {
  return z.object({
    name: z.string().trim().min(1, 'name_required'),
    acronym: z.string(),
    country: z.string().trim().toUpperCase().length(2, 'country_invalid'),
    email: z
      .string()
      .trim()
      .min(1, 'email_required')
      .refine((value) => EMAIL.test(value), 'email_invalid'),
    contacts: z.array(
      z.object({
        medium: z.enum(FEDERATION_CONTACT_MEDIA),
        tag: z.string(),
        value: z.string(),
      }),
    ),
    seasons: z.array(
      z.object({
        id: z.string().optional(),
        seasonName: z.string().trim().min(1, 'season_name_required'),
        currency: z.enum(FEDERATION_CURRENCIES),
        clubCost: moneyField,
        licenseTypes: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string().trim().min(1, 'license_type_name_required'),
            priceRows: z.array(
              z
                .object({
                  id: z.string().optional(),
                  kind: z.enum(LICENSE_PRICE_ROW_KINDS),
                  label: z.string(),
                  birthYearFrom: z.string(),
                  cost: moneyField,
                  reduction: moneyField,
                  chargePrice: moneyField,
                })
                .superRefine((row, ctx) => {
                  if (row.kind !== 'CUSTOM') return;
                  if (!row.label.trim()) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['label'], message: 'price_row_label_required' });
                  }
                  const year = row.birthYearFrom.trim();
                  if (!/^\d{4}$/.test(year)) {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      path: ['birthYearFrom'],
                      message: 'birth_year_required',
                    });
                    return;
                  }
                  const parsed = Number.parseInt(year, 10);
                  if (parsed < 1900 || parsed > 2100) {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      path: ['birthYearFrom'],
                      message: 'birth_year_invalid',
                    });
                  }
                }),
            ),
          }),
        ),
      }),
    ),
  });
}

export type FederationFormValues = z.infer<ReturnType<typeof federationSchema>>;
