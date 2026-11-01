#!/usr/bin/env bash
# Wait until PostgreSQL inside `dms-postgres` accepts connections (`pg_isready`).
# Used before Prisma migrate/seed so schema apply does not race a half-started engine.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

CONTAINER="${POSTGRES_CONTAINER:-dms-postgres}"
TIMEOUT="${WAIT_FOR_DB_TIMEOUT:-60}"
INTERVAL="${WAIT_FOR_DB_INTERVAL:-2}"

if [[ -t 1 ]]; then
  C_RESET='\033[0m'
  C_GREEN='\033[32m'
  C_YELLOW='\033[33m'
  C_RED='\033[31m'
  C_CYAN='\033[36m'
else
  C_RESET='' C_GREEN='' C_YELLOW='' C_RED='' C_CYAN=''
fi

log()  { printf '%b\n' "${C_CYAN}▸${C_RESET} $*"; }
ok()   { printf '%b\n' "${C_GREEN}✔${C_RESET} $*"; }
warn() { printf '%b\n' "${C_YELLOW}▲${C_RESET} $*"; }
err()  { printf '%b\n' "${C_RED}✖${C_RESET} $*" >&2; }

if ! command -v docker >/dev/null 2>&1; then
  err "docker is not on PATH"
  exit 1
fi

log "Waiting for PostgreSQL in ${CONTAINER} (timeout ${TIMEOUT}s)"

elapsed=0
while (( elapsed < TIMEOUT )); do
  if docker exec "${CONTAINER}" sh -c 'pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"' >/dev/null 2>&1; then
    ok "PostgreSQL is ready to accept connections (${elapsed}s)"
    exit 0
  fi

  status="$(docker inspect --format '{{.State.Status}}' "${CONTAINER}" 2>/dev/null || true)"
  if [[ -z "${status}" ]]; then
    warn "Container ${CONTAINER} is not running yet (${elapsed}s/${TIMEOUT}s)"
  else
    warn "PostgreSQL not ready (container=${status}, ${elapsed}s/${TIMEOUT}s)"
  fi

  sleep "${INTERVAL}"
  elapsed=$((elapsed + INTERVAL))
done

err "PostgreSQL in ${CONTAINER} did not become ready within ${TIMEOUT}s"
if docker inspect "${CONTAINER}" >/dev/null 2>&1; then
  docker logs --tail 40 "${CONTAINER}" || true
fi
exit 1
