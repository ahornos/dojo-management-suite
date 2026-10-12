#!/bin/sh
# Compiles workspace packages and marks their dist/ trees world-writable
# so a host user can clean bind-mounted artifacts created by the container as root.
set -e

pnpm --filter @dms/shared-types --filter @dms/shared-auth run build

for dir in /app/packages/shared-types/dist /app/packages/shared-auth/dist; do
  if [ -d "$dir" ]; then
    chmod -R a+rwX "$dir" || true
  fi
done
