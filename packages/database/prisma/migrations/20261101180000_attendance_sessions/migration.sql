-- Quick check-in: class sessions and per-student roll-call marks.
-- The legacy `attendances` table (rank-hour audit) is unchanged.
-- Idempotent for `migrate reset`.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AttendanceStatus') THEN
    CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "attendance_sessions" (
    "id" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "instructorUserId" TEXT NOT NULL,
    "maxCapacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "attendance_records" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "attendance_sessions_disciplineId_date_idx"
    ON "attendance_sessions"("disciplineId", "date");

CREATE INDEX IF NOT EXISTS "attendance_sessions_instructorUserId_idx"
    ON "attendance_sessions"("instructorUserId");

CREATE UNIQUE INDEX IF NOT EXISTS "attendance_records_sessionId_studentProfileId_key"
    ON "attendance_records"("sessionId", "studentProfileId");

CREATE INDEX IF NOT EXISTS "attendance_records_studentProfileId_idx"
    ON "attendance_records"("studentProfileId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'attendance_records_sessionId_fkey'
  ) THEN
    ALTER TABLE "attendance_records"
      ADD CONSTRAINT "attendance_records_sessionId_fkey"
      FOREIGN KEY ("sessionId") REFERENCES "attendance_sessions"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;
