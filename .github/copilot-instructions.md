# Django React Boilerplate Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup the Repository

#### Non-Docker Setup (Recommended for Development)

1. **Install Poetry (if not already installed):**
   ```bash
   pip install poetry==2.0.1 --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org
   ```

2. **Setup Environment Files:**
   ```bash
   cp backend/gold3/settings/local_base.py backend/gold3/settings/local.py
   ```
   
   Create `backend/.env` with:
   ```
   DJANGO_SETTINGS_MODULE=gold3.settings.local
   DATABASE_URL=sqlite:///db.sqlite3
   CELERY_BROKER_URL=
   REDIS_URL=redis://localhost:6379
   ```

3. **Install Dependencies and Setup Backend:**
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   poetry install  # Takes ~11 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
   npm install     # Takes ~45 seconds. NEVER CANCEL. Set timeout to 10+ minutes.
   ```

4. **Make scripts executable:**
   ```bash
   chmod +x backend/manage.py
   chmod +x render_build.sh
   ```

5. **Setup Database:**
   ```bash
   cd backend
   poetry run python manage.py makemigrations
   poetry run python manage.py migrate
   cd ..
   ```

6. **Generate API Schema and Client:**
   ```bash
   poetry run python backend/manage.py spectacular --color --file backend/schema.yml
   npm run openapi-ts  # Generates TypeScript API client
   ```

#### Docker Setup (Network limitations may cause issues)

**WARNING:** Docker setup may fail due to SSL certificate verification issues in sandboxed environments. If you encounter SSL/certificate errors, use the non-Docker setup instead.

```bash
make docker_setup     # NEVER CANCEL. Takes 5-15 minutes. Set timeout to 30+ minutes.
make docker_makemigrations
make docker_migrate
make docker_up
```

### Build and Development

#### Frontend Build and Development
```bash
npm run build   # Takes ~10 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
npm run dev     # Starts development server on http://localhost:3000
```

#### Backend Development
```bash
cd backend
poetry run python manage.py runserver  # Starts server on http://127.0.0.1:8000
```

### Testing

#### Run All Tests
```bash
make test       # Takes ~1.4 seconds. Backend Django tests with parallel execution
npm run test    # Takes ~1.3 seconds. Frontend Jest tests
```

#### Individual Test Commands
```bash
# Backend tests (with existing DB)
poetry run backend/manage.py test backend/ --parallel --keepdb

# Backend tests (reset DB)
poetry run backend/manage.py test backend/ --parallel

# Frontend tests with watch mode
npm run test:watch

# Frontend test coverage
npm run coverage
```

### Linting and Code Quality

```bash
npm run lint                           # Takes ~4 seconds. ESLint with auto-fix
poetry run ruff check ./backend/       # Takes ~0.4 seconds. Python linting
poetry run ruff check ./backend/ --fix # Auto-fix Python linting issues
```

### Production Deployment

```bash
./render_build.sh  # Takes ~13 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
```

**Note:** The render_build.sh script requires environment variables:
- `ENABLE_DJANGO_COLLECTSTATIC=1` (optional)
- `AUTO_MIGRATE=1` (optional)
- `SENTRY_API_KEY`, `SENTRY_ORG`, `SENTRY_PROJECT_NAME` (for source maps)

## Validation

### Always Run These Validation Steps After Making Changes

1. **Lint and Format Code:**
   ```bash
   npm run lint
   poetry run ruff check ./backend/ --fix
   ```

2. **Run Tests:**
   ```bash
   make test
   npm run test
   ```

3. **Build and Test Application:**
   ```bash
   npm run build
   poetry run python backend/manage.py check --deploy
   ```

4. **Test Full Application Flow:**
   - Start backend: `poetry run python backend/manage.py runserver`
   - Start frontend: `npm run dev` (in separate terminal)
   - Test API endpoints work
   - Verify frontend connects to backend properly

### Critical Build Time Expectations

- **Poetry install:** ~11 seconds (NEVER CANCEL - set 5+ minute timeout)
- **npm install:** ~45 seconds (NEVER CANCEL - set 10+ minute timeout)
- **npm run build:** ~10 seconds (NEVER CANCEL - set 5+ minute timeout)
- **Django tests:** ~1.4 seconds (parallel execution with keepdb)
- **Frontend tests:** ~1.3 seconds (Jest)
- **Linting:** 0.4-4 seconds
- **Production build:** ~13 seconds (NEVER CANCEL - set 5+ minute timeout)

### Known Issues and Workarounds

1. **Docker SSL Certificate Issues:** If `make docker_setup` fails with SSL certificate errors, use the non-Docker setup instead.

2. **Missing staticfiles Warning:** The warning `/backend/staticfiles/` directory not found is normal during development and can be ignored.

3. **TypeScript Version Warning:** ESLint may warn about TypeScript version compatibility (5.9.2 vs supported <5.4.0). This is non-blocking.

4. **Redis Connection:** The application expects Redis for django-defender. If Redis is not available locally, update `REDIS_URL` in `.env` or disable defender in settings.

## Common Tasks

### Project Structure
```
.
├── README.md
├── Makefile                  # Build and test commands
├── package.json             # Frontend dependencies and scripts
├── pyproject.toml           # Backend dependencies and config
├── docker-compose.yml       # Multi-service Docker setup
├── render_build.sh          # Production build script
├── backend/                 # Django application
│   ├── manage.py
│   ├── gold3/settings/      # Django settings modules
│   ├── users/               # User management app
│   └── common/              # Shared utilities
├── frontend/                # React TypeScript application
│   ├── js/                  # TypeScript source files
│   ├── sass/                # SCSS styling
│   └── assets/              # Static assets
└── .github/workflows/       # CI/CD pipelines
```

### Technology Stack
- **Backend:** Django 5.2.5 + Django REST Framework + PostgreSQL/SQLite
- **Frontend:** React 19.1.1 + TypeScript + Webpack + Bootstrap 5
- **Task Queue:** Celery with Redis/RabbitMQ
- **Package Management:** Poetry (Python) + npm (Node.js)
- **Testing:** Django TestCase + Jest
- **Linting:** Ruff (Python) + ESLint (TypeScript)
- **Deployment:** Render.com ready with source maps for Sentry

### Environment Requirements
- **Python:** 3.12+
- **Node.js:** 20.13+
- **Poetry:** 2.0.1
- **Docker:** Optional (may have network limitations)

### Key Configuration Files
- `backend/gold3/settings/local.py` - Local development settings
- `backend/.env` - Environment variables
- `package.json` - Frontend scripts and dependencies
- `pyproject.toml` - Backend dependencies and ruff config
- `.eslintrc.js` - Frontend linting configuration
- `render.yaml` - Production deployment configuration

Always validate changes by running the complete test suite and ensuring the application starts correctly with both backend and frontend servers.