-- Prospects have no application access; they are tracked as Role.TRIAL identities
-- plus StudentProfile.status = TRIAL.

DO $$ BEGIN
  ALTER TYPE "Role" ADD VALUE 'TRIAL';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
