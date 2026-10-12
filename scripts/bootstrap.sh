#!/usr/bin/env bash
# Interactive local lifecycle for Dojo Management Suite.
# Run from anywhere:  ./scripts/bootstrap.sh
set -euo pipefail

# Repository root (parent of scripts/), never the caller's cwd or scripts/.
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${WORKSPACE_ROOT}"

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

if [[ -t 1 ]]; then
  C_RESET='\033[0m'
  C_BOLD='\033[1m'
  C_DIM='\033[2m'
  C_RED='\033[31m'
  C_GREEN='\033[32m'
  C_YELLOW='\033[33m'
  C_BLUE='\033[34m'
  C_CYAN='\033[36m'
else
  C_RESET='' C_BOLD='' C_DIM='' C_RED='' C_GREEN='' C_YELLOW='' C_BLUE='' C_CYAN=''
fi

UNIT_STATUS="skipped"
E2E_STATUS="skipped"
CSV_PATH=""
CLEANED="no"
PRUNED="no"

log()  { printf '%b\n' "${C_CYAN}▸${C_RESET} $*"; }
ok()   { printf '%b\n' "${C_GREEN}✔${C_RESET} $*"; }
warn() { printf '%b\n' "${C_YELLOW}▲${C_RESET} $*"; }
err()  { printf '%b\n' "${C_RED}✖${C_RESET} $*" >&2; }
hr()   { printf '%b\n' "${C_DIM}────────────────────────────────────────────────────────${C_RESET}"; }

confirm() {
  local prompt="$1"
  local reply=""
  read -r -p "$(printf '%b' "${C_YELLOW}?${C_RESET} ${prompt} [y/N] ")" reply || true
  [[ "${reply}" =~ ^[Yy]([Ee][Ss])?$ ]]
}

load_env() {
  if [[ ! -f "${WORKSPACE_ROOT}/.env" ]]; then
    cp "${WORKSPACE_ROOT}/.env.example" "${WORKSPACE_ROOT}/.env"
    warn "Created .env from .env.example — set JWT_SECRET and INTERNAL_API_KEY before production use."
  fi
  set -a
  # shellcheck disable=SC1091
  source "${WORKSPACE_ROOT}/.env"
  set +a
}

# Strip surrounding quotes/whitespace and expand ~ / ~/... without eval.
# Relative paths resolve against WORKSPACE_ROOT. Prints an absolute path or returns 1.
resolve_user_file() {
  local raw="$1"
  local resolved

  raw="${raw#"${raw%%[![:space:]]*}"}"
  raw="${raw%"${raw##*[![:space:]]}"}"

  if [[ ${#raw} -ge 2 ]]; then
    local first="${raw:0:1}"
    local last="${raw: -1}"
    if [[ ( "${first}" == '"' && "${last}" == '"' ) || ( "${first}" == "'" && "${last}" == "'" ) ]]; then
      raw="${raw:1:${#raw}-2}"
    fi
  fi

  if [[ "${raw}" == "~" ]]; then
    raw="${HOME}"
  elif [[ "${raw}" == "~/"* ]]; then
    raw="${HOME}/${raw:2}"
  fi

  if [[ "${raw}" != /* ]]; then
    raw="${WORKSPACE_ROOT}/${raw}"
  fi

  if command -v realpath >/dev/null 2>&1; then
    resolved="$(realpath -m "${raw}")"
  else
    resolved="${raw}"
  fi

  if [[ ! -f "${resolved}" ]]; then
    return 1
  fi

  printf '%s' "${resolved}"
}

host_database_url() {
  if [[ -n "${DATABASE_URL_HOST:-}" ]]; then
    printf '%s' "${DATABASE_URL_HOST}"
    return
  fi
  printf '%s' "postgresql://dojo_admin:dojo_password@localhost:5433/dojo_management_suite?schema=public"
}

wait_healthy() {
  local container="$1"
  local attempts="${2:-30}"
  local i status
  for ((i = 1; i <= attempts; i++)); do
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container}" 2>/dev/null || true)"
    if [[ "${status}" == "healthy" ]]; then
      ok "${container} is healthy"
      return 0
    fi
    sleep 2
  done
  err "${container} did not become healthy in time"
  docker compose ps
  return 1
}

wait_http() {
  local url="$1"
  local attempts="${2:-45}"
  local i
  for ((i = 1; i <= attempts; i++)); do
    if curl -fsS --max-time 3 "${url}" >/dev/null 2>&1; then
      ok "${url}"
      return 0
    fi
    sleep 2
  done
  warn "Still unreachable: ${url}"
  return 1
}

probe() {
  local url="$1"
  if curl -fsS --max-time 3 "${url}" >/dev/null 2>&1; then
    printf 'up'
  else
    printf 'down'
  fi
}

run_suite() {
  local label="$1"
  local -n _status_var="$2"
  shift 2
  log "Running ${label}"
  if "$@"; then
    ok "${label} passed"
    _status_var="passed"
  else
    err "${label} failed"
    _status_var="failed"
  fi
}

printf '%b\n' "${C_BOLD}${C_BLUE}"
cat <<'BANNER'
╔══════════════════════════════════════════════════════════╗
║           Dojo Management Suite — bootstrap              ║
╚══════════════════════════════════════════════════════════╝
BANNER
printf '%b' "${C_RESET}"
log "Workspace: ${WORKSPACE_ROOT}"
hr

# -----------------------------------------------------------------------------
# 1. Clean state
# -----------------------------------------------------------------------------
log "Step 1/7  Clean Docker state"
if confirm "Stop the stack and delete Compose volumes (docker compose down -v)?"; then
  docker compose down -v
  CLEANED="yes"
  ok "Volumes removed"
  if confirm "Also run docker system prune -a --volumes -f (wipe all unused images/networks/volumes)?"; then
    docker system prune -a --volumes -f
    PRUNED="yes"
    ok "System prune finished"
  fi
else
  warn "Skipped volume teardown"
fi
hr

# -----------------------------------------------------------------------------
# 2. Environment + CSV
# -----------------------------------------------------------------------------
log "Step 2/7  Environment and seed CSV"
load_env

DEFAULT_CSV_HINT="${WORKSPACE_ROOT}/data/users.csv"
printf '%b\n' "${C_DIM}CSV headers: Name, Surname/s, Email, Init password, Role, ID / Passport,${C_RESET}"
printf '%b\n' "${C_DIM}birthDate, Phone, Address, City, State / Province, Postal Code, Country${C_RESET}"
printf '%b\n' "${C_DIM}Tab-complete a path. ~ is expanded; relative paths are from the repo root.${C_RESET}"
read -e -r -p "$(printf '%b' "${C_YELLOW}?${C_RESET} Users CSV path [Enter to skip, example ${DEFAULT_CSV_HINT}]: ")" CSV_INPUT || true

if [[ -n "${CSV_INPUT}" ]]; then
  if ! CSV_PATH="$(resolve_user_file "${CSV_INPUT}")"; then
    err "CSV not found after resolving '${CSV_INPUT}' (repo root: ${WORKSPACE_ROOT})"
    exit 1
  fi
  ok "Will import users from ${CSV_PATH}"
else
  warn "No CSV — seed will create SUPER_ADMIN and belt ranks only"
fi
hr

# -----------------------------------------------------------------------------
# 3. Dependencies & build
# -----------------------------------------------------------------------------
log "Step 3/7  pnpm install + workspace build"
pnpm install
pnpm build
ok "Workspace packages compiled"
hr

# -----------------------------------------------------------------------------
# 4. Database & seeding (Postgres must be up first)
# -----------------------------------------------------------------------------
log "Step 4/7  Database generate, push, seed"
docker compose up -d postgres redis
wait_healthy dms-postgres 40
wait_healthy dms-redis 20

export DATABASE_URL
DATABASE_URL="$(host_database_url)"
log "Host Prisma URL uses localhost:5433 (not the in-container hostname)"

pnpm --filter @dms/database db:generate
pnpm --filter @dms/database db:push
pnpm --filter @dms/database db:seed
ok "Schema applied and default seed executed"

if [[ -n "${CSV_PATH}" ]]; then
  log "Importing users CSV"
  pnpm --filter @dms/database exec ts-node prisma/import-users.ts "${CSV_PATH}"
  ok "CSV import finished"
fi
hr

# -----------------------------------------------------------------------------
# 5. Full stack
# -----------------------------------------------------------------------------
log "Step 5/7  docker compose up -d --build"
docker compose up -d --build
ok "Compose project started"
log "Waiting for HTTP surfaces"
wait_http "http://localhost:3000/api" 60 || true
wait_http "http://localhost:5173" 30 || true
hr

# -----------------------------------------------------------------------------
# 6. Tests
# -----------------------------------------------------------------------------
log "Step 6/7  Unit and E2E suites"
set +e
run_suite "unit tests" UNIT_STATUS pnpm run test:unit
run_suite "e2e tests" E2E_STATUS pnpm run test:e2e
set -e
hr

# -----------------------------------------------------------------------------
# 7. Executive summary
# -----------------------------------------------------------------------------
GW="$(probe http://localhost:3000/api)"
AUTH="$(probe http://localhost:3001/api/docs)"
ACAD="$(probe http://localhost:3002/api/docs)"
FIN="$(probe http://localhost:3003/api/docs)"
PWA="$(probe http://localhost:5173)"

status_color() {
  case "$1" in
    passed|up|healthy|yes) printf '%b' "${C_GREEN}" ;;
    failed|down)           printf '%b' "${C_RED}" ;;
    *)                     printf '%b' "${C_YELLOW}" ;;
  esac
}

printf '%b\n' "${C_BOLD}"
cat <<'HDR'
╔══════════════════════════════════════════════════════════╗
║                    Executive summary                     ║
╚══════════════════════════════════════════════════════════╝
HDR
printf '%b' "${C_RESET}"

printf '\n%bContainers%b\n' "${C_BOLD}" "${C_RESET}"
docker compose ps

printf '\n%bLifecycle%b\n' "${C_BOLD}" "${C_RESET}"
printf '  volumes wiped     : %b%s%b\n' "$(status_color "${CLEANED}")" "${CLEANED}" "${C_RESET}"
printf '  system prune      : %b%s%b\n' "$(status_color "${PRUNED}")" "${PRUNED}" "${C_RESET}"
printf '  users CSV         : %s\n' "${CSV_PATH:-skipped}"

printf '\n%bTests%b\n' "${C_BOLD}" "${C_RESET}"
printf '  unit              : %b%s%b\n' "$(status_color "${UNIT_STATUS}")" "${UNIT_STATUS}" "${C_RESET}"
printf '  e2e               : %b%s%b\n' "$(status_color "${E2E_STATUS}")" "${E2E_STATUS}" "${C_RESET}"

printf '\n%bEndpoints%b\n' "${C_BOLD}" "${C_RESET}"
printf '  PWA               : %b%-4s%b  http://localhost:5173\n' "$(status_color "${PWA}")" "${PWA}" "${C_RESET}"
printf '  Gateway health    : %b%-4s%b  http://localhost:3000/api\n' "$(status_color "${GW}")" "${GW}" "${C_RESET}"
printf '  Gateway Swagger   :          http://localhost:3000/api/docs\n'
printf '  Auth Swagger      : %b%-4s%b  http://localhost:3001/api/docs\n' "$(status_color "${AUTH}")" "${AUTH}" "${C_RESET}"
printf '  Academic Swagger  : %b%-4s%b  http://localhost:3002/api/docs\n' "$(status_color "${ACAD}")" "${ACAD}" "${C_RESET}"
printf '  Financial Swagger : %b%-4s%b  http://localhost:3003/api/docs\n' "$(status_color "${FIN}")" "${FIN}" "${C_RESET}"

printf '\n%bDefault seed login%b  %s\n' "${C_BOLD}" "${C_RESET}" "${DEFAULT_SUPER_ADMIN_EMAIL:-superadmin@foxjiujitsuacademy.com}"
printf '%b\n' "${C_DIM}Change JWT_SECRET and INTERNAL_API_KEY in .env before any shared environment.${C_RESET}"
hr

if [[ "${UNIT_STATUS}" == "failed" || "${E2E_STATUS}" == "failed" ]]; then
  exit 1
fi
