-- Tagged federation contacts, multi-type licenses with age/seasonal pricing, and price history.
-- Idempotent so `migrate reset` can replay against databases that already received these objects.

DO $$ BEGIN
  CREATE TYPE "FederationContactMedium" AS ENUM ('EMAIL', 'PHONE', 'ADDRESS');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "acronym" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "territorialScope" TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS "federation_contacts" (
  "id" TEXT NOT NULL,
  "federationId" TEXT NOT NULL,
  "medium" "FederationContactMedium" NOT NULL,
  "value" TEXT NOT NULL,
  "tag" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "federation_contacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "federation_license_types" (
  "id" TEXT NOT NULL,
  "federationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "holderType" "LicenseHolderType" NOT NULL DEFAULT 'STUDENT',
  "minAge" INTEGER,
  "maxAge" INTEGER,
  "discountMonth" INTEGER,
  "discountDay" INTEGER,
  "clubCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "baseCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "finalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "costReduction" DECIMAL(10,2),
  "priceReduction" DECIMAL(10,2),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "federation_license_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "license_price_history" (
  "id" TEXT NOT NULL,
  "licenseTypeId" TEXT NOT NULL,
  "effectiveFrom" TIMESTAMP(3) NOT NULL,
  "effectiveTo" TIMESTAMP(3),
  "clubCost" DECIMAL(10,2) NOT NULL,
  "baseCost" DECIMAL(10,2) NOT NULL,
  "finalPrice" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "license_price_history_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "federation_contacts"
    ADD CONSTRAINT "federation_contacts_federationId_fkey"
    FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "federation_license_types"
    ADD CONSTRAINT "federation_license_types_federationId_fkey"
    FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "federation_license_types"
    ADD CONSTRAINT "federation_license_types_federationId_name_key"
    UNIQUE ("federationId", "name");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "license_price_history"
    ADD CONSTRAINT "license_price_history_licenseTypeId_fkey"
    FOREIGN KEY ("licenseTypeId") REFERENCES "federation_license_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "federation_contacts_federationId_medium_idx"
  ON "federation_contacts"("federationId", "medium");

CREATE INDEX IF NOT EXISTS "federation_license_types_federationId_idx"
  ON "federation_license_types"("federationId");

CREATE INDEX IF NOT EXISTS "license_price_history_licenseTypeId_effectiveFrom_idx"
  ON "license_price_history"("licenseTypeId", "effectiveFrom");

ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "licenseTypeId" TEXT;

CREATE INDEX IF NOT EXISTS "student_licenses_licenseTypeId_idx" ON "student_licenses"("licenseTypeId");

INSERT INTO "federation_contacts" ("id", "federationId", "medium", "value", "tag", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, f."id", 'PHONE', f."phone", 'Sede', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "federations" f
WHERE f."phone" IS NOT NULL AND btrim(f."phone") <> ''
  AND NOT EXISTS (
    SELECT 1 FROM "federation_contacts" c
    WHERE c."federationId" = f."id" AND c."medium" = 'PHONE' AND c."value" = f."phone"
  );

INSERT INTO "federation_contacts" ("id", "federationId", "medium", "value", "tag", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, f."id", 'EMAIL', f."email", 'Sede', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "federations" f
WHERE f."email" IS NOT NULL AND btrim(f."email") <> ''
  AND NOT EXISTS (
    SELECT 1 FROM "federation_contacts" c
    WHERE c."federationId" = f."id" AND c."medium" = 'EMAIL' AND c."value" = f."email"
  );

INSERT INTO "federation_contacts" ("id", "federationId", "medium", "value", "tag", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, f."id", 'ADDRESS', f."address", 'Sede', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "federations" f
WHERE f."address" IS NOT NULL AND btrim(f."address") <> ''
  AND NOT EXISTS (
    SELECT 1 FROM "federation_contacts" c
    WHERE c."federationId" = f."id" AND c."medium" = 'ADDRESS' AND c."value" = f."address"
  );

INSERT INTO "federation_license_types" (
  "id", "federationId", "name", "holderType", "minAge", "maxAge",
  "discountMonth", "discountDay", "clubCost", "baseCost", "finalPrice",
  "costReduction", "priceReduction", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  f."id",
  'Standard',
  'STUDENT',
  NULL,
  NULL,
  f."discountMonthThreshold",
  NULL,
  COALESCE(NULLIF(f."clubCost", 0), f."clubFee", 0),
  COALESCE(NULLIF(f."studentBaseCost", 0), f."studentPrice", 0),
  COALESCE(NULLIF(f."studentFinalPrice", 0), f."studentSalePrice", 0),
  f."studentCostReduction",
  f."studentPriceReduction",
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "federations" f
WHERE NOT EXISTS (
  SELECT 1 FROM "federation_license_types" t WHERE t."federationId" = f."id"
);

INSERT INTO "license_price_history" (
  "id", "licenseTypeId", "effectiveFrom", "effectiveTo", "clubCost", "baseCost", "finalPrice", "createdAt"
)
SELECT
  gen_random_uuid()::text,
  t."id",
  t."createdAt",
  NULL,
  t."clubCost",
  t."baseCost",
  t."finalPrice",
  CURRENT_TIMESTAMP
FROM "federation_license_types" t
WHERE NOT EXISTS (
  SELECT 1 FROM "license_price_history" h WHERE h."licenseTypeId" = t."id"
);
