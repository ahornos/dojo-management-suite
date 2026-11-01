#!/usr/bin/env bash
# Deep-clean the local Docker environment for Dojo Management Suite.
# Removes the Compose stack (both profiles), project volumes, unused Docker
# objects, and any leftover bind-mount data directories.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

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

# Named volumes `dms-pg-data` and `dms-redis-data` (see docker-compose.yml) are
# the only persistence. `down -v` deletes those project volumes; there is no
# host bind-mount under ./.data or ./docker-data. The prune step below also
# drops unused named volumes left behind by older Compose project names.
# Profiles MUST be passed: a bare `docker compose down` selects zero services.

warn "Stopping the stack and deleting Compose volumes (infra + app profiles)"
docker compose --profile infra --profile app down -v --remove-orphans
ok "Containers, project networks, and Compose volumes removed"

# Defensive: remove bind-mount dirs if a future compose file adds them.
for dir in .data docker-data data/postgres data/redis; do
  if [[ -e "${ROOT}/${dir}" ]]; then
    warn "Removing leftover data directory ${dir}"
    rm -rf "${ROOT:?}/${dir}"
    ok "Removed ${dir}"
  fi
done

warn "Pruning unused Docker images, containers, networks, and volumes (machine-wide)"
docker system prune -a --volumes -f
ok "Docker system prune complete — local environment is pristine"
