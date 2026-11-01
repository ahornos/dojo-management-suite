-- Optional gender on identity (competition categories / stats).
-- Structured leave audit on student_status_history for PAUSED / DROPPED.
-- All columns are nullable so existing rows and callers remain valid.

DO $$ BEGIN
  CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE IF EXISTS "users" ADD COLUMN IF NOT EXISTS "gender" "Gender";

DO $$ BEGIN
  CREATE TYPE "LeaveReason" AS ENUM ('ECONOMIC', 'TIME_CONFLICT', 'INJURY', 'MOVED', 'DISSATISFIED', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "LeaveNoticeMethod" AS ENUM ('PHONE', 'WHATSAPP', 'IN_PERSON', 'RECEPTION', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE IF EXISTS "student_status_history" ADD COLUMN IF NOT EXISTS "leaveReason" "LeaveReason";
ALTER TABLE IF EXISTS "student_status_history" ADD COLUMN IF NOT EXISTS "leaveNoticeMethod" "LeaveNoticeMethod";
ALTER TABLE IF EXISTS "student_status_history" ADD COLUMN IF NOT EXISTS "customReasonDetails" TEXT;
