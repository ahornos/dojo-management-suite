/**
 * @file schema.ts
 * @description Zod schemas for academy identity, theme, and SEPA billing forms.
 */

import { z } from 'zod';
import { isValidIban, toIban } from '@/lib/iban';

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === '' || /^https?:\/\//i.test(value), 'url_invalid');

const hexColor = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{6})$/i, 'hex_invalid');

/**
 * Tenant identity and locale. Legal name / tax id are mirrored to financial-service on save.
 *
 * @returns {z.ZodObject} Schema for the General tab.
 */
export function academyGeneralSchema() {
  return z.object({
    legalName: z.string().trim().min(1, 'required'),
    tradeName: z.string().trim().min(1, 'required'),
    taxId: z.string().trim().min(1, 'required'),
    officialEmail: z.string().trim().email('email_invalid'),
    timezone: z.string().min(1, 'required'),
    defaultCurrency: z.string().length(3, 'currency_invalid'),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string().length(2, 'country_invalid').or(z.literal('')),
  });
}

/**
 * White-label assets and the full design-token catalog.
 *
 * @returns {z.ZodObject} Schema for the Appearance tab.
 */
export function academyAppearanceSchema() {
  return z.object({
    logoUrl: optionalUrl,
    isotypeUrl: optionalUrl,
    pdfLogoUrl: optionalUrl,
    primary: hexColor,
    secondary: hexColor,
    contentBg: hexColor,
    cardBg: hexColor,
    sidebarBg: hexColor,
    sidebarText: hexColor,
    topbarBg: hexColor,
    footerBg: hexColor,
    textPrimary: hexColor,
    textSecondary: hexColor,
    textOnPrimary: hexColor,
    success: hexColor,
    warning: hexColor,
    error: hexColor,
    info: hexColor,
    fontFamily: z.enum(['Inter', 'Roboto', 'Open Sans']),
    fontScaleBase: z.number().min(0.85).max(1.25),
    borderRadius: z.enum(['sharp', 'subtle', 'rounded']),
    spacingDensity: z.enum(['compact', 'comfortable']),
    shadowStyle: z.enum(['flat', 'soft', 'prominent']),
  });
}

/**
 * SEPA creditor fields owned by financial-service.
 *
 * @returns {z.ZodObject} Schema for the Billing tab.
 */
export function academyBillingSchema() {
  return z.object({
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

export type AcademyGeneralValues = z.infer<ReturnType<typeof academyGeneralSchema>>;
export type AcademyAppearanceValues = z.infer<ReturnType<typeof academyAppearanceSchema>>;
export type AcademyBillingValues = z.infer<ReturnType<typeof academyBillingSchema>>;
