-- Optional short label for dense directory cells (e.g. BJJ for Brazilian Jiu-Jitsu).
ALTER TABLE IF EXISTS "disciplines" ADD COLUMN IF NOT EXISTS "acronym" TEXT;
