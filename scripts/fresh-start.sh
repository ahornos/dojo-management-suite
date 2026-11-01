#!/usr/bin/env bash
# Full clean boot: nuke → infra → wait for Postgres → migrate + seed → app stack.
# Prevents Prisma from racing a container that is up but not accepting connections.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

if [[ -t 1 ]]; then
  C_RESET='\033[0m'
  C_BOLD='\033[1m'
  C_GREEN='\033[32m'
  C_YELLOW='\033[33m'
  C_RED='\033[31m'
  C_CYAN='\033[36m'
  C_BLUE='\033[34m'
else
  C_RESET='' C_BOLD='' C_GREEN='' C_YELLOW='' C_RED='' C_CYAN='' C_BLUE=''
fi

log()  { printf '%b\n' "${C_CYAN}▸${C_RESET} $*"; }
ok()   { printf '%b\n' "${C_GREEN}✔${C_RESET} $*"; }
warn() { printf '%b\n' "${C_YELLOW}▲${C_RESET} $*"; }
err()  { printf '%b\n' "${C_RED}✖${C_RESET} $*" >&2; }

if ! command -v docker >/dev/null 2>&1; then
  err "docker is not on PATH"
  exit 1
fi
if ! command -v pnpm >/dev/null 2>&1; then
  err "pnpm is not on PATH (this repo uses pnpm@12.6.0 via corepack)"
  exit 1
fi

printf '%b\n' "${C_BOLD}${C_BLUE}"
cat <<'BANNER'
╔══════════════════════════════════════════════════════════╗
║         Dojo Management Suite — fresh-start              ║
╚══════════════════════════════════════════════════════════╝
BANNER
printf '%b' "${C_RESET}"

# -----------------------------------------------------------------------------
# 0. Environment file (host Prisma uses DATABASE_URL_HOST via with-host-database-url.sh)
# -----------------------------------------------------------------------------
log "Step 0/5  Environment"
if [[ ! -f "${ROOT}/.env" ]]; then
  cp "${ROOT}/.env.example" "${ROOT}/.env"
  warn "Created .env from .env.example — review JWT_SECRET and INTERNAL_API_KEY"
else
  ok ".env already present"
fi

# -----------------------------------------------------------------------------
# 1. Deep clean
# -----------------------------------------------------------------------------
log "Step 1/5  Deep clean (nuke)"
bash "${ROOT}/scripts/nuke.sh"
ok "Deep clean finished"

# -----------------------------------------------------------------------------
# 2. Infrastructure only (postgres + redis)
# -----------------------------------------------------------------------------
log "Step 2/5  Starting infra profile"
docker compose --profile infra up -d --remove-orphans
ok "Infra containers requested"

# -----------------------------------------------------------------------------
# 3. Block until PostgreSQL accepts connections
# -----------------------------------------------------------------------------
log "Step 3/5  Waiting for PostgreSQL"
bash "${ROOT}/scripts/wait-for-db.sh"
ok "Database handshake complete"

# -----------------------------------------------------------------------------
# 4. Schema + seed (non-interactive; --force skips Prisma's reset prompt)
# -----------------------------------------------------------------------------
log "Step 4/5  Prisma migrate reset + seed"
if [[ ! -d "${ROOT}/node_modules" ]]; then
  warn "node_modules missing — running pnpm install"
  pnpm install
fi
pnpm --filter @dms/database db:generate
pnpm db:migrate:reset -- --force --skip-seed
pnpm db:seed
ok "Migrations applied and catalog seed executed"

# -----------------------------------------------------------------------------
# 5. Application profile (infra stays up; both profiles so depends_on resolves)
# -----------------------------------------------------------------------------
log "Step 5/5  Starting app profile (build)"
docker compose --profile infra --profile app up -d --build --remove-orphans
ok "Application services are starting"

printf '\n%bFresh start complete.%b Infra is healthy and the app stack is up.\n' "${C_GREEN}" "${C_RESET}"
printf '%bNext:%b PWA http://localhost:5173  ·  Gateway http://localhost:3000/api\n' "${C_CYAN}" "${C_RESET}"
