-- Decouple federation identity from seasonal pricing matrices.
-- Idempotent so `migrate reset` can replay against databases that already received these objects.

DO $$ BEGIN
  CREATE TYPE "LicensePriceRowKind" AS ENUM ('INSTRUCTOR', 'ADULT', 'CUSTOM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "federation_seasons" (
  "id" TEXT NOT NULL,
  "federationId" TEXT NOT NULL,
  "seasonName" TEXT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "clubCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "federation_seasons_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "federation_seasons"
    ADD CONSTRAINT "federation_seasons_federationId_fkey"
    FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "federation_seasons"
    ADD CONSTRAINT "federation_seasons_federationId_seasonName_key"
    UNIQUE ("federationId", "seasonName");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "federation_seasons_federationId_idx" ON "federation_seasons"("federationId");

ALTER TABLE IF EXISTS "federation_license_types" ADD COLUMN IF NOT EXISTS "seasonId" TEXT;

INSERT INTO "federation_seasons" (
  "id", "federationId", "seasonName", "currency", "clubCost", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  f."id",
  '2026-2027',
  'EUR',
  COALESCE(NULLIF(f."clubCost", 0), f."clubFee", 0),
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "federations" f
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'federations' AND column_name = 'clubFee'
)
  AND NOT EXISTS (
    SELECT 1 FROM "federation_seasons" s WHERE s."federationId" = f."id"
  );

UPDATE "federation_license_types" t
SET "seasonId" = s."id"
FROM "federation_seasons" s
WHERE t."seasonId" IS NULL
  AND s."federationId" = t."federationId";

INSERT INTO "federation_license_types" (
  "id", "seasonId", "name", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  s."id",
  'Standard',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "federation_seasons" s
WHERE NOT EXISTS (
  SELECT 1 FROM "federation_license_types" t WHERE t."seasonId" = s."id"
);

CREATE TABLE IF NOT EXISTS "federation_license_price_rows" (
  "id" TEXT NOT NULL,
  "licenseTypeId" TEXT NOT NULL,
  "kind" "LicensePriceRowKind" NOT NULL,
  "label" TEXT NOT NULL DEFAULT '',
  "birthYearFrom" INTEGER,
  "cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "reduction" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "chargePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "federation_license_price_rows_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "federation_license_price_rows"
    ADD CONSTRAINT "federation_license_price_rows_licenseTypeId_fkey"
    FOREIGN KEY ("licenseTypeId") REFERENCES "federation_license_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "federation_license_price_rows_licenseTypeId_kind_idx"
  ON "federation_license_price_rows"("licenseTypeId", "kind");

INSERT INTO "federation_license_price_rows" (
  "id", "licenseTypeId", "kind", "label", "birthYearFrom", "cost", "reduction", "chargePrice", "sortOrder", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  t."id",
  'INSTRUCTOR',
  '',
  NULL,
  COALESCE(f."instructorPrice", 0),
  0,
  COALESCE(f."instructorSalePrice", 0),
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "federation_license_types" t
JOIN "federation_seasons" s ON s."id" = t."seasonId"
JOIN "federations" f ON f."id" = s."federationId"
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'federations' AND column_name = 'instructorPrice'
)
  AND NOT EXISTS (
    SELECT 1 FROM "federation_license_price_rows" r
    WHERE r."licenseTypeId" = t."id" AND r."kind" = 'INSTRUCTOR'
  );

INSERT INTO "federation_license_price_rows" (
  "id", "licenseTypeId", "kind", "label", "birthYearFrom", "cost", "reduction", "chargePrice", "sortOrder", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  t."id",
  'ADULT',
  '',
  NULL,
  COALESCE(NULLIF(t."baseCost", 0), NULLIF(f."studentBaseCost", 0), f."studentPrice", 0),
  COALESCE(t."costReduction", f."studentCostReduction", 0),
  COALESCE(NULLIF(t."finalPrice", 0), NULLIF(f."studentFinalPrice", 0), f."studentSalePrice", 0),
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "federation_license_types" t
JOIN "federation_seasons" s ON s."id" = t."seasonId"
JOIN "federations" f ON f."id" = s."federationId"
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'federation_license_types' AND column_name = 'baseCost'
)
  AND NOT EXISTS (
    SELECT 1 FROM "federation_license_price_rows" r
    WHERE r."licenseTypeId" = t."id" AND r."kind" = 'ADULT'
  );

UPDATE "federations" f
SET "email" = COALESCE(
  NULLIF(btrim(f."email"), ''),
  (
    SELECT c."value" FROM "federation_contacts" c
    WHERE c."federationId" = f."id" AND c."medium" = 'EMAIL'
    ORDER BY c."createdAt" ASC
    LIMIT 1
  ),
  'unset@invalid'
)
WHERE f."email" IS NULL OR btrim(f."email") = '';

ALTER TABLE IF EXISTS "federations" ALTER COLUMN "email" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "federation_license_types" ALTER COLUMN "seasonId" SET NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "federation_license_types"
    ADD CONSTRAINT "federation_license_types_seasonId_fkey"
    FOREIGN KEY ("seasonId") REFERENCES "federation_seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "federation_license_types"
    ADD CONSTRAINT "federation_license_types_seasonId_name_key"
    UNIQUE ("seasonId", "name");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "federation_license_types_seasonId_idx" ON "federation_license_types"("seasonId");

ALTER TABLE IF EXISTS "federation_license_types" DROP CONSTRAINT IF EXISTS "federation_license_types_federationId_fkey";
ALTER TABLE IF EXISTS "federation_license_types" DROP CONSTRAINT IF EXISTS "federation_license_types_federationId_name_key";
DROP INDEX IF EXISTS "federation_license_types_federationId_idx";

ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "federationId";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "holderType";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "minAge";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "maxAge";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "discountMonth";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "discountDay";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "clubCost";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "baseCost";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "finalPrice";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "costReduction";
ALTER TABLE IF EXISTS "federation_license_types" DROP COLUMN IF EXISTS "priceReduction";

DROP TABLE IF EXISTS "license_price_history";

ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "territorialScope";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "phone";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "address";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "studentPrice";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "instructorPrice";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "technicalDirectorPrice";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "clubFee";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "studentSalePrice";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "instructorSalePrice";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "clubCost";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "studentBaseCost";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "studentFinalPrice";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "discountMonthThreshold";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "studentCostReduction";
ALTER TABLE IF EXISTS "federations" DROP COLUMN IF EXISTS "studentPriceReduction";
