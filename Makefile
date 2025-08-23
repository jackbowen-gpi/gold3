SHELL := /bin/bash # Use bash syntax
ARG := $(word 2, $(MAKECMDGOALS) )

# =============================================================================
# Development Commands
# =============================================================================

.PHONY: help
help: ## Show this help message
	@echo "Gold3 Development Commands"
	@echo "========================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Setup and Installation
.PHONY: install
install: ## Install all dependencies
	poetry install
	npm install

.PHONY: setup
setup: install ## Setup development environment
	poetry run pre-commit install
	@echo "✅ Development environment setup complete!"

# Development Servers
.PHONY: dev
dev: ## Start development servers (frontend and backend)
	@echo "Starting development servers..."
	@make -j2 dev-backend dev-frontend

.PHONY: dev-backend
dev-backend: ## Start Django development server
	@echo "🔧 Starting Django development server..."
	poetry run python backend/manage.py runserver

.PHONY: dev-frontend
dev-frontend: ## Start React development server
	@echo "⚛️  Starting React development server..."
	npm run dev

# Database Management
.PHONY: migrate
migrate: ## Run Django migrations
	poetry run python backend/manage.py migrate

.PHONY: makemigrations
makemigrations: ## Create Django migrations
	poetry run python backend/manage.py makemigrations

.PHONY: db-reset
db-reset: ## Reset database (WARNING: destroys all data)
	poetry run python backend/manage.py flush --no-input
	poetry run python backend/manage.py migrate

.PHONY: superuser
superuser: ## Create Django superuser
	poetry run python backend/manage.py createsuperuser

# Code Quality
.PHONY: lint
lint: ## Run all linters
	@echo "🔍 Running backend linting..."
	poetry run ruff check backend/
	@echo "🔍 Running frontend linting..."
	npm run lint

.PHONY: lint-fix
lint-fix: ## Fix linting issues automatically
	@echo "🔧 Fixing backend linting issues..."
	poetry run ruff check --fix backend/
	@echo "🔧 Fixing frontend linting issues..."
	npm run lint

.PHONY: format
format: ## Format code
	@echo "📝 Formatting backend code..."
	poetry run ruff format backend/
	@echo "📝 Formatting frontend code..."
	npm run lint

.PHONY: type-check
type-check: ## Run TypeScript type checking
	npm run tsc

# Testing
.PHONY: test
test: ## Run all tests
	@echo "🧪 Running backend tests..."
	poetry run python backend/manage.py test backend/ $(ARG) --parallel --keepdb
	@echo "🧪 Running frontend tests..."
	npm test

.PHONY: test-backend
test-backend: ## Run backend tests only
	poetry run python backend/manage.py test backend/ $(ARG) --parallel --keepdb

.PHONY: test-frontend
test-frontend: ## Run frontend tests only
	npm test

.PHONY: test-reset
test-reset: ## Run tests with fresh database
	poetry run python backend/manage.py test backend/ $(ARG) --parallel

.PHONY: coverage
coverage: ## Run tests with coverage
	poetry run coverage run --source='backend' backend/manage.py test backend/
	poetry run coverage report
	npm run coverage

# Cleanup
.PHONY: clean
clean: ## Clean up generated files
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete
	@find . -name "*.log" -delete
	@rm -rf frontend/webpack_bundles/*
	@rm -rf .coverage htmlcov/
	@echo "🧹 Cleaned up generated files"

.PHONY: clean-deps
clean-deps: ## Clean dependencies and reinstall
	rm -rf node_modules package-lock.json
	poetry env remove --all
	make install

# =============================================================================
# Docker Commands
# =============================================================================

.PHONY: docker-build
docker-build: ## Build Docker images
	docker-compose -f docker-compose.dev.yml build

.PHONY: docker-up
docker-up: ## Start all services with Docker
	docker-compose -f docker-compose.dev.yml up

.PHONY: docker-down
docker-down: ## Stop all Docker services
	docker-compose -f docker-compose.dev.yml down

.PHONY: docker-setup
docker-setup: ## Setup Docker development environment
	docker volume create gold3_dbdata
	docker-compose -f docker-compose.dev.yml build --no-cache
	docker-compose -f docker-compose.dev.yml run --rm backend python manage.py migrate
	@echo "✅ Docker development environment setup complete!"

.PHONY: docker-test
docker-test: ## Run tests in Docker
	docker-compose -f docker-compose.dev.yml run --rm backend python manage.py test $(ARG) --parallel --keepdb

.PHONY: docker-logs
docker-logs: ## View Docker logs
	docker-compose -f docker-compose.dev.yml logs -f $(ARG)

# =============================================================================
# API and Schema
# =============================================================================

.PHONY: schema
schema: ## Generate API schema
	poetry run python backend/manage.py spectacular --color --file schema.yml

.PHONY: openapi
openapi: schema ## Generate OpenAPI TypeScript client
	npm run openapi-ts

# =============================================================================
# Production Commands
# =============================================================================

.PHONY: build
build: ## Build for production
	npm run build
	poetry run python backend/manage.py collectstatic --noinput

.PHONY: prod-setup
prod-setup: ## Setup production environment
	poetry install --without dev
	npm ci --only=production
	make build

# =============================================================================
# Utility Commands
# =============================================================================

.PHONY: shell
shell: ## Open Django shell
	poetry run python backend/manage.py shell

.PHONY: dbshell
dbshell: ## Open database shell
	poetry run python backend/manage.py dbshell

.PHONY: check
check: ## Run Django system checks
	poetry run python backend/manage.py check

.PHONY: update-deps
update-deps: ## Update all dependencies
	poetry update
	npm update

.PHONY: security-check
security-check: ## Run security audits
	poetry run safety check
	npm audit

# Default target
.DEFAULT_GOAL := help

docker_up:
	docker compose up -d --remove-orphans

docker_update_dependencies:
	docker compose down
	docker compose up -d --build

docker_down:
	docker compose down

docker_logs:
	docker compose logs -f $(ARG)

docker_makemigrations:
	docker compose run --rm backend python manage.py makemigrations

docker_migrate:
	docker compose run --rm backend python manage.py migrate

docker_backend_shell:
	docker compose run --rm backend bash

docker_backend_update_schema:
	docker compose run --rm backend python manage.py spectacular --color --file schema.yml

docker_frontend_update_api:
	docker compose run --rm frontend npm run openapi-ts

docker_jb_test:
	docker compose run --rm backend python manage.py check --deploy --fail-level WARNING
