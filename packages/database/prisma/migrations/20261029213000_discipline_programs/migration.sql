-- Current Prisma model: Discipline → DisciplineProgram → BeltRank.
-- Init only created disciplines + belt_ranks.disciplineId. Seed nested creates need programs.

ALTER TABLE IF EXISTS "disciplines" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE IF EXISTS "disciplines" ADD COLUMN IF NOT EXISTS "acronym" TEXT;

CREATE TABLE IF NOT EXISTS "discipline_programs" (
    "id" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL DEFAULT 0,
    "maxAge" INTEGER NOT NULL DEFAULT 99,

    CONSTRAINT "discipline_programs_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF to_regclass('public.disciplines') IS NULL THEN
    RETURN;
  END IF;

  ALTER TABLE "discipline_programs" DROP CONSTRAINT IF EXISTS "discipline_programs_disciplineId_fkey";
  ALTER TABLE "discipline_programs"
    ADD CONSTRAINT "discipline_programs_disciplineId_fkey"
    FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
END $$;

ALTER TABLE IF EXISTS "belt_ranks" ADD COLUMN IF NOT EXISTS "minMonthsRequired" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "belt_ranks" ADD COLUMN IF NOT EXISTS "minHoursRequired" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS "belt_ranks" ADD COLUMN IF NOT EXISTS "disciplineProgramId" TEXT;

ALTER TABLE IF EXISTS "belt_ranks" DROP CONSTRAINT IF EXISTS "belt_ranks_disciplineId_fkey";
ALTER TABLE IF EXISTS "belt_ranks" DROP COLUMN IF EXISTS "disciplineId";

DO $$
BEGIN
  IF to_regclass('public.belt_ranks') IS NULL OR to_regclass('public.discipline_programs') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM "belt_ranks" WHERE "disciplineProgramId" IS NULL) THEN
    ALTER TABLE "belt_ranks" ALTER COLUMN "disciplineProgramId" SET NOT NULL;
  END IF;

  ALTER TABLE "belt_ranks" DROP CONSTRAINT IF EXISTS "belt_ranks_disciplineProgramId_fkey";
  ALTER TABLE "belt_ranks"
    ADD CONSTRAINT "belt_ranks_disciplineProgramId_fkey"
    FOREIGN KEY ("disciplineProgramId") REFERENCES "discipline_programs"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
END $$;
