#!/bin/sh
# Compiles workspace packages (so Nest `tsconfig.build.json` can resolve @dms/* from dist/)
# and marks their dist/ trees world-writable so a host user can clean bind-mounted
# artifacts created by the container as root.
set -e

node /app/scripts/ensure-workspace-packages.cjs --build

for dir in /app/packages/shared-types/dist /app/packages/shared-auth/dist; do
  if [ -d "$dir" ]; then
    chmod -R a+rwX "$dir" || true
  fi
done
