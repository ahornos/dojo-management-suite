#!/usr/bin/env bash
# Load the monorepo root .env and point Prisma at DATABASE_URL_HOST.
# Host commands cannot resolve the in-container hostname `postgres`.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -f "${ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/.env"
  set +a
fi

if [[ -n "${DATABASE_URL_HOST:-}" ]]; then
  export DATABASE_URL="${DATABASE_URL_HOST}"
fi

exec "$@"
