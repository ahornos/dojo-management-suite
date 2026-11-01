-- Seasonal federation pricing matrix + affiliation license payment status.
-- Idempotent so `migrate reset` can replay against databases that already received db-push columns.

DO $$ BEGIN
  CREATE TYPE "AffiliationLicenseStatus" AS ENUM ('PENDING', 'PAID', 'EXEMPT', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "clubCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "studentBaseCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "studentFinalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "discountMonthThreshold" INTEGER;
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "studentCostReduction" DECIMAL(10,2);
ALTER TABLE IF EXISTS "federations" ADD COLUMN IF NOT EXISTS "studentPriceReduction" DECIMAL(10,2);

UPDATE "federations" SET "clubCost" = "clubFee" WHERE "clubCost" = 0 AND "clubFee" <> 0;
UPDATE "federations" SET "studentBaseCost" = "studentPrice" WHERE "studentBaseCost" = 0 AND "studentPrice" <> 0;
UPDATE "federations" SET "studentFinalPrice" = "studentSalePrice" WHERE "studentFinalPrice" = 0 AND "studentSalePrice" <> 0;

ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "status" "AffiliationLicenseStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "payerUserId" TEXT;
ALTER TABLE IF EXISTS "student_licenses" ADD COLUMN IF NOT EXISTS "isExempt" BOOLEAN NOT NULL DEFAULT false;

UPDATE "student_licenses" SET "status" = 'PAID' WHERE "isPaid" = true AND "status" = 'PENDING';

CREATE INDEX IF NOT EXISTS "student_licenses_payerUserId_idx" ON "student_licenses"("payerUserId");
