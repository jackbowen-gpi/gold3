# Development Environment Configuration

This file contains configuration and scripts for development environment setup.

## Quick Start

```bash
# Install dependencies
npm install
poetry install

# Setup environment
cp backend/gold3/settings/local.py.example backend/gold3/settings/local.py

# Run development servers
npm run dev          # Frontend dev server
poetry run python backend/manage.py runserver  # Backend dev server
```

## Development Scripts

### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter with auto-fix

### Backend
- `poetry run python backend/manage.py runserver` - Start Django dev server
- `poetry run python backend/manage.py test` - Run tests
- `poetry run ruff check backend/` - Run linter
- `poetry run python backend/manage.py migrate` - Run migrations

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gold3

# Django
SECRET_KEY=your-secret-key
DEBUG=True

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
```

## Docker Development

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend

# Run migrations in container
docker-compose exec backend python manage.py migrate

# View logs
docker-compose logs -f backend
```

## Code Quality

### Pre-commit Hooks

Install pre-commit hooks to ensure code quality:

```bash
poetry run pre-commit install
```

This will run:
- Ruff (Python linting and formatting)
- ESLint (JavaScript/TypeScript linting)
- Type checking
- Tests

### Manual Quality Checks

```bash
# Backend
poetry run ruff check backend/
poetry run python backend/manage.py test

# Frontend
npm run lint
npm run test
npm run tsc  # Type checking
```

## Debugging

### Backend Debugging

Add breakpoints in your Python code:

```python
import pdb; pdb.set_trace()
```

Or use VS Code debugger with the included launch configuration.

### Frontend Debugging

Use browser developer tools or VS Code debugger.

## Common Issues

### Port Conflicts
- Frontend dev server: http://localhost:3000
- Backend server: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Database Issues
```bash
# Reset database
poetry run python backend/manage.py flush
poetry run python backend/manage.py migrate
```

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```