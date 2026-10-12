-- Bounded-context isolation: academic audit columns store auth-service user ids
-- as plain strings. Physical FKs into `users` are not allowed.

ALTER TABLE "student_status_history" DROP CONSTRAINT IF EXISTS "student_status_history_changedById_fkey";
ALTER TABLE "profile_update_requests" DROP CONSTRAINT IF EXISTS "profile_update_requests_reviewedById_fkey";
ALTER TABLE "graduation_requests" DROP CONSTRAINT IF EXISTS "graduation_requests_proposedById_fkey";
ALTER TABLE "graduation_requests" DROP CONSTRAINT IF EXISTS "graduation_requests_approvedById_fkey";
