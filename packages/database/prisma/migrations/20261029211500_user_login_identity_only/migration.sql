-- User is a login identity only. National ID and contact demographics belong to
-- student_profiles. Historical `users` after migrate reset has scalar `role`
-- (not `roles`) and no `isActive`; align the table with the current Prisma model.

ALTER TABLE IF EXISTS "users" DROP CONSTRAINT IF EXISTS "users_dni_key";
DROP INDEX IF EXISTS "users_dni_key";

ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "dni";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "birthDate";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "phone";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "address";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "city";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "state";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "postalCode";
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "country";

ALTER TABLE IF EXISTS "users" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'roles'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "roles" "Role"[] NOT NULL DEFAULT ARRAY['STUDENT']::"Role"[];

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'role'
    ) THEN
      UPDATE "users" SET "roles" = ARRAY["role"];
      ALTER TABLE "users" DROP COLUMN "role";
    END IF;
  END IF;
END $$;
