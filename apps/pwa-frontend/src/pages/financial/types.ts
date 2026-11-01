/**
 * @file types.ts
 * @description Tenant financial configuration contracts shared by the PWA financial module.
 */

/**
 * Academy SEPA creditor / invoicing identity returned by `GET /financial/config`.
 */
export interface FinancialConfig {
  id: string;
  tenantId: string;
  legalName: string;
  taxId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  creditorId: string;
  iban: string;
  bic: string | null;
  stripeAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Partial payload of `PUT /financial/config`.
 */
export type UpdateFinancialConfigPayload = Omit<
  FinancialConfig,
  'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'bic' | 'stripeAccountId'
> & {
  bic: string;
  stripeAccountId?: string | null;
};
