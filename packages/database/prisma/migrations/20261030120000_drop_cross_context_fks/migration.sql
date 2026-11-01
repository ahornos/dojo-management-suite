-- Drop physical Foreign Keys from financial (and license) tables onto student_profiles.
-- studentProfileId remains a logical UUID. AffiliationLicense.holderUserId is nullable for minors.
-- federationId / holderUserId on licenses are logical ids (no cross-context @relation).
--
-- Tables created only via `db push` (never in earlier migration files) are skipped on
-- empty shadow databases so `migrate dev` / `migrate reset` can replay this folder.

DO $$
BEGIN
  IF to_regclass('public.student_discounts') IS NOT NULL THEN
    ALTER TABLE "student_discounts" DROP CONSTRAINT IF EXISTS "student_discounts_studentProfileId_fkey";
    CREATE INDEX IF NOT EXISTS "student_discounts_studentProfileId_idx" ON "student_discounts"("studentProfileId");
  END IF;

  IF to_regclass('public.student_fees') IS NOT NULL THEN
    ALTER TABLE "student_fees" DROP CONSTRAINT IF EXISTS "student_fees_studentProfileId_fkey";
  END IF;

  IF to_regclass('public.student_licenses') IS NOT NULL THEN
    ALTER TABLE "student_licenses" DROP CONSTRAINT IF EXISTS "student_licenses_studentProfileId_fkey";
    ALTER TABLE "student_licenses" DROP CONSTRAINT IF EXISTS "student_licenses_federationId_fkey";
    ALTER TABLE "student_licenses" DROP CONSTRAINT IF EXISTS "student_licenses_holderUserId_fkey";
    ALTER TABLE "student_licenses" ALTER COLUMN "holderUserId" DROP NOT NULL;
    CREATE INDEX IF NOT EXISTS "student_licenses_studentProfileId_idx" ON "student_licenses"("studentProfileId");
    CREATE UNIQUE INDEX IF NOT EXISTS "student_licenses_tenantId_federationId_studentProfileId_sea_key"
      ON "student_licenses"("tenantId", "federationId", "studentProfileId", "season");
  END IF;

  IF to_regclass('public.student_subscriptions') IS NOT NULL THEN
    ALTER TABLE "student_subscriptions" DROP CONSTRAINT IF EXISTS "student_subscriptions_studentProfileId_fkey";
    CREATE INDEX IF NOT EXISTS "student_subscriptions_studentProfileId_idx" ON "student_subscriptions"("studentProfileId");
  END IF;
END $$;
