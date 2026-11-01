-- SEPA mandates must identify the legal account holder, who may differ from the
-- billed student (e.g. a PARENT paying for a minor). accountHolderId is a logical
-- auth-service user id with no physical FK into `users`.

ALTER TABLE IF EXISTS "bank_mandates" ADD COLUMN IF NOT EXISTS "accountHolderName" TEXT NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS "bank_mandates" ADD COLUMN IF NOT EXISTS "accountHolderId" TEXT;

ALTER TABLE IF EXISTS "bank_mandates" ALTER COLUMN "accountHolderName" DROP DEFAULT;
