-- Bounded-context isolation: identity (users) is owned by auth-service, so the academic tables
-- keep only a logical reference (userId) and no longer enforce a physical foreign key.

-- DropForeignKey (IF EXISTS: init never created guardians_userId_fkey, and names can differ by casing)
ALTER TABLE IF EXISTS "student_profiles" DROP CONSTRAINT IF EXISTS "student_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "guardians" DROP CONSTRAINT IF EXISTS "guardians_userId_fkey";
