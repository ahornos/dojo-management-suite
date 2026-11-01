-- Tenant identity, timezone, white-label theme, and reserved Stripe account id.
-- Idempotent for `migrate reset`. SEPA columns stay on tenant_financial_configs.

ALTER TABLE "academy_settings"
    ADD COLUMN IF NOT EXISTS "legalName" TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS "tradeName" TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS "taxId" TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS "timezone" TEXT NOT NULL DEFAULT 'Europe/Madrid',
    ADD COLUMN IF NOT EXISTS "defaultCurrency" TEXT NOT NULL DEFAULT 'EUR',
    ADD COLUMN IF NOT EXISTS "isotypeUrl" TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS "themeConfig" JSONB NOT NULL DEFAULT '{}';

UPDATE "academy_settings"
SET "tradeName" = CASE
    WHEN COALESCE("tradeName", '') <> '' THEN "tradeName"
    WHEN COALESCE("brandName", '') <> '' THEN "brandName"
    ELSE COALESCE("displayName", '')
END
WHERE COALESCE("tradeName", '') = '';

ALTER TABLE "tenant_financial_configs"
    ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;
