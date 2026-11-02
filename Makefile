# Thin wrappers around pnpm / Compose. Logic lives in package.json and scripts/.
#
# Compose only acts on services in the *enabled* profile set. `up` starts
# infra+app; down/reset/nuke must pass the same profiles or they are a no-op.
# Persistence is Docker named volumes (`dms-pg-data`, `dms-redis-data`), not
# host bind-mounts — `down -v` and `nuke` remove that data.
COMPOSE_PROFILES_FLAGS := --profile infra --profile app

CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RESET  := \033[0m

.DEFAULT_GOAL := help

.PHONY: help up down reset nuke deep-clean wait-db fresh-start rebuild db-migrate db-reset seed import import-pipeline bootstrap

help:
	@printf '$(CYAN)Dojo Management Suite — local orchestration$(RESET)\n\n'
	@printf '$(GREEN)Stack$(RESET)\n'
	@printf '  make up              Start infra + app (build, detached)\n'
	@printf '  make down            Stop containers (keeps named volumes)\n'
	@printf '  make reset           Stop containers and delete project volumes\n'
	@printf '  make bootstrap       Interactive lifecycle (clean, migrate, tests)\n\n'
	@printf '$(GREEN)Pristine / from-zero$(RESET)\n'
	@printf '  make nuke            Deep clean: compose down -v, prune images/volumes\n'
	@printf '  make deep-clean      Alias for nuke\n'
	@printf '  make fresh-start     Nuke → infra → wait-for-db → migrate+seed → app\n'
	@printf '  make rebuild         Alias for fresh-start\n\n'
	@printf '$(GREEN)Database$(RESET)\n'
	@printf '  make wait-db         Block until dms-postgres accepts connections\n'
	@printf '  make db-migrate      prisma migrate dev (host URL)\n'
	@printf '  make db-reset        prisma migrate reset (interactive)\n'
	@printf '  make seed            prisma db seed\n'
	@printf '  make import          Import users then students from import-data/\n'
	@printf '  make import-pipeline Import numbered 01-08 Google Sheets CSVs from import-data/\n'

up:
	@printf '$(CYAN)▸$(RESET) Starting infra + app profiles\n'
	pnpm docker:up
	@printf '$(GREEN)✔$(RESET) Stack requested\n'

down:
	@printf '$(YELLOW)▲$(RESET) Stopping infra + app (volumes kept)\n'
	docker compose $(COMPOSE_PROFILES_FLAGS) down --remove-orphans
	@printf '$(GREEN)✔$(RESET) Containers stopped\n'

reset:
	@printf '$(YELLOW)▲$(RESET) Stopping infra + app and deleting named volumes\n'
	docker compose $(COMPOSE_PROFILES_FLAGS) down -v --remove-orphans
	@printf '$(GREEN)✔$(RESET) Project volumes removed\n'

nuke deep-clean:
	@bash scripts/nuke.sh

wait-db:
	@bash scripts/wait-for-db.sh

fresh-start rebuild:
	@bash scripts/fresh-start.sh

db-migrate:
	@printf '$(CYAN)▸$(RESET) prisma migrate dev\n'
	pnpm db:migrate

db-reset:
	@printf '$(YELLOW)▲$(RESET) prisma migrate reset (interactive — data will be lost)\n'
	pnpm db:migrate:reset

seed:
	@printf '$(CYAN)▸$(RESET) prisma db seed\n'
	pnpm db:seed

import:
	@printf '$(CYAN)▸$(RESET) Importing users and students\n'
	pnpm import:users && pnpm import:students
	@printf '$(GREEN)✔$(RESET) Imports finished\n'

import-pipeline:
	@printf '$(CYAN)▸$(RESET) Importing numbered Google Sheets CSVs (01-08)\n'
	pnpm import:pipeline
	@printf '$(GREEN)✔$(RESET) Pipeline import finished\n'

bootstrap:
	@bash scripts/bootstrap.sh
