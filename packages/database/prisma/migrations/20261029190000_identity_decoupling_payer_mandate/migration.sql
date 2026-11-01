-- Strict identity decoupling + payer-owned SEPA mandates.
-- 1) Academic identity lives on student_profiles (minors have no users row).
-- 2) bank_mandates belong to payerUserId; students point at a mandate via logical bankMandateId.

-- ---------------------------------------------------------------------------
-- Student profiles: demographics + optional login identity + mandate pointer
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "firstName" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "lastName" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "dni" TEXT;
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3);
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'ES';
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "gender" "Gender";
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "bankMandateId" TEXT;

-- Copy login identity onto the academic profile. Historical `users` only has
-- firstName/lastName (and gender after 20261012172000). dni, birthDate, phone and
-- address already live on student_profiles from init — do not read them from users.
UPDATE "student_profiles" AS sp
SET
  "firstName" = COALESCE(NULLIF(sp."firstName", ''), u."firstName", ''),
  "lastName" = COALESCE(NULLIF(sp."lastName", ''), u."lastName", ''),
  "gender" = COALESCE(sp."gender", u."gender")
FROM "users" AS u
WHERE sp."userId" = u."id";

ALTER TABLE IF EXISTS "student_profiles" ALTER COLUMN "userId" DROP NOT NULL;

-- Minors keep the profile and lose the login identity. Orphan users are left in place (no hard delete).
UPDATE "student_profiles"
SET "userId" = NULL
WHERE "birthDate" IS NOT NULL
  AND "birthDate" > (CURRENT_DATE - INTERVAL '18 years');

CREATE INDEX IF NOT EXISTS "student_profiles_bankMandateId_idx" ON "student_profiles"("bankMandateId");

-- ---------------------------------------------------------------------------
-- Bank mandates: payer owns the IBAN; coverage pointer moves onto the student
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS "bank_mandates" ADD COLUMN IF NOT EXISTS "payerUserId" TEXT;

DO $$
BEGIN
  IF to_regclass('public.bank_mandates') IS NULL THEN
    RETURN;
  END IF;

  -- Prefer explicit account holder, then the student's login user, then the first linked guardian.
  UPDATE "bank_mandates" AS bm
  SET "payerUserId" = COALESCE(
    NULLIF(bm."accountHolderId", ''),
    sp."userId",
    (
      SELECT g."userId"
      FROM "student_guardians" AS sg
      INNER JOIN "guardians" AS g ON g."id" = sg."guardianId"
      WHERE sg."studentProfileId" = bm."studentProfileId"
      ORDER BY sg."guardianId"
      LIMIT 1
    )
  )
  FROM "student_profiles" AS sp
  WHERE sp."id" = bm."studentProfileId"
    AND (bm."payerUserId" IS NULL OR bm."payerUserId" = '');

  -- Any mandate that still has no payer cannot satisfy NOT NULL; keep the student user as last resort.
  UPDATE "bank_mandates" AS bm
  SET "payerUserId" = sp."userId"
  FROM "student_profiles" AS sp
  WHERE sp."id" = bm."studentProfileId"
    AND (bm."payerUserId" IS NULL OR bm."payerUserId" = '')
    AND sp."userId" IS NOT NULL;

  DELETE FROM "bank_mandates" WHERE "payerUserId" IS NULL OR "payerUserId" = '';

  UPDATE "student_profiles" AS sp
  SET "bankMandateId" = bm."id"
  FROM "bank_mandates" AS bm
  WHERE bm."studentProfileId" = sp."id"
    AND bm."isActive" = true
    AND sp."bankMandateId" IS NULL;
END $$;

ALTER TABLE IF EXISTS "bank_mandates" ALTER COLUMN "payerUserId" SET NOT NULL;

ALTER TABLE IF EXISTS "bank_mandates" DROP CONSTRAINT IF EXISTS "bank_mandates_studentProfileId_fkey";
ALTER TABLE IF EXISTS "bank_mandates" DROP CONSTRAINT IF EXISTS "BankMandate_studentProfileId_fkey";
DROP INDEX IF EXISTS "bank_mandates_tenantId_studentProfileId_idx";
ALTER TABLE IF EXISTS "bank_mandates" DROP COLUMN IF EXISTS "studentProfileId";
ALTER TABLE IF EXISTS "bank_mandates" DROP COLUMN IF EXISTS "accountHolderId";

DO $$
BEGIN
  IF to_regclass('public.bank_mandates') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "bank_mandates_tenantId_payerUserId_idx" ON "bank_mandates"("tenantId", "payerUserId")';
  END IF;
END $$;
