-- Federation catalog (financial-service) + affiliation license history (academic-service).
-- Drops the cross-context FK from student_licenses to federations.

DO $$ BEGIN
  CREATE TYPE "LicenseHolderType" AS ENUM ('STUDENT', 'INSTRUCTOR', 'TECHNICAL_DIRECTOR', 'CLUB');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "tenantId" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "country" TEXT NOT NULL DEFAULT 'ES';
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "studentPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "instructorPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "technicalDirectorPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "clubFee" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "studentSalePrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "instructorSalePrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE IF EXISTS "federations" ALTER COLUMN "tenantId" DROP DEFAULT;

DROP INDEX IF EXISTS "federations_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "federations_tenantId_name_key" ON "federations"("tenantId", "name");
CREATE INDEX IF NOT EXISTS "federations_tenantId_idx" ON "federations"("tenantId");

ALTER TABLE IF EXISTS "student_licenses" DROP CONSTRAINT IF EXISTS "student_licenses_federationId_fkey";
DROP INDEX IF EXISTS "student_licenses_studentProfileId_federationId_academicYear_key";

ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "tenantId" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "holderUserId" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "holderType" "LicenseHolderType" NOT NULL DEFAULT 'STUDENT';
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "season" TEXT;
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "validUntil" TIMESTAMP(3);
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "isPaid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "amountCharged" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'student_licenses' AND column_name = 'academicYear'
  ) THEN
    EXECUTE 'UPDATE "student_licenses" SET "season" = "academicYear" WHERE "season" IS NULL';
  END IF;
END $$;
UPDATE "student_licenses" SET "season" = 'unknown' WHERE "season" IS NULL;
UPDATE "student_licenses" SET "validUntil" = CURRENT_TIMESTAMP + INTERVAL '1 year' WHERE "validUntil" IS NULL;
UPDATE "student_licenses" sl
SET "holderUserId" = sp."userId"
FROM "student_profiles" sp
WHERE sl."studentProfileId" = sp."id" AND sl."holderUserId" = '';
UPDATE "student_licenses" SET "licenseNumber" = CONCAT('LEGACY-', "id") WHERE "licenseNumber" IS NULL OR "licenseNumber" = '';

ALTER TABLE IF EXISTS "student_licenses" ALTER COLUMN "season" SET NOT NULL;
ALTER TABLE IF EXISTS "student_licenses" ALTER COLUMN "validUntil" SET NOT NULL;
ALTER TABLE IF EXISTS "student_licenses" ALTER COLUMN "holderUserId" DROP DEFAULT;
ALTER TABLE IF EXISTS "student_licenses" ALTER COLUMN "tenantId" DROP DEFAULT;
ALTER TABLE IF EXISTS "student_licenses" ALTER COLUMN "studentProfileId" DROP NOT NULL;
ALTER TABLE IF EXISTS "student_licenses" ALTER COLUMN "licenseNumber" SET NOT NULL;

ALTER TABLE IF EXISTS "student_licenses" DROP COLUMN IF EXISTS "academicYear";

CREATE UNIQUE INDEX IF NOT EXISTS "student_licenses_tenantId_federationId_holderUserId_season_key"
  ON "student_licenses"("tenantId", "federationId", "holderUserId", "season");
CREATE INDEX IF NOT EXISTS "student_licenses_tenantId_validUntil_isActive_idx"
  ON "student_licenses"("tenantId", "validUntil", "isActive");
CREATE INDEX IF NOT EXISTS "student_licenses_tenantId_federationId_season_idx"
  ON "student_licenses"("tenantId", "federationId", "season");

CREATE TABLE IF NOT EXISTS "federation_season_charges" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "federationId" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "holderType" "LicenseHolderType" NOT NULL,
    "holderUserId" TEXT,
    "studentProfileId" TEXT,
    "licenseId" TEXT,
    "costAmount" DECIMAL(10,2) NOT NULL,
    "saleAmount" DECIMAL(10,2) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_season_charges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "federation_season_charges_tenantId_federationId_season_holderType_holderUserId_key"
  ON "federation_season_charges"("tenantId", "federationId", "season", "holderType", "holderUserId");
CREATE INDEX IF NOT EXISTS "federation_season_charges_tenantId_federationId_season_idx"
  ON "federation_season_charges"("tenantId", "federationId", "season");

ALTER TABLE IF EXISTS "federation_season_charges"
  ADD CONSTRAINT "federation_season_charges_federationId_fkey"
  FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
