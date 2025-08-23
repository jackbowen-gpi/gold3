# Django React Boilerplate

Django React Boilerplate is a Django 5 backend with React TypeScript frontend web application using Poetry for Python dependency management and npm for JavaScript dependencies.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup
Run these commands in exact order for a fresh clone:
- `poetry install` -- installs Python dependencies. Takes ~15 seconds. NEVER CANCEL.
- `npm install` -- installs Node.js dependencies. Takes ~45 seconds. NEVER CANCEL.
- `cp backend/gold3/settings/local.py.example backend/gold3/settings/local.py`
- `cp .history/backend/.env_20250822185521 backend/.env` 
- Edit `backend/.env` to use SQLite: change `DATABASE_URL=postgres://gold3:password@db:5432/gold3` to `DATABASE_URL=sqlite:///db.sqlite3`
- `chmod +x backend/manage.py` -- make manage.py executable
- `cd backend && poetry run python manage.py migrate` -- creates database tables. Takes ~3 seconds.
- `cd backend && poetry run python manage.py spectacular --color --file schema.yml` -- generates OpenAPI schema. Takes ~2 seconds.
- `npm run openapi-ts` -- generates TypeScript API client. Takes ~2 seconds.

### Build and Development
- `npm run build` -- builds frontend for production. Takes ~10 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- `npm run dev` -- starts webpack dev server on port 3000. NEVER CANCEL during development.
- `cd backend && poetry run python manage.py runserver` -- starts Django server on port 8000. NEVER CANCEL during development.
- Access the application at `http://localhost:8000` (Django serves the full app, not port 3000)

### Testing
- `npm run test` -- runs frontend Jest tests. Takes ~2 seconds.
- `make test` -- runs backend Django tests. Takes ~2 seconds.
- Both test suites must pass before committing changes.

### Linting and Code Quality
- `npm run lint` -- runs ESLint on frontend code. Takes ~4 seconds. Auto-fixes issues.
- `poetry run ruff check ./backend/ --fix` -- runs Ruff linter on backend code. Takes ~1 second. Auto-fixes issues.
- `npm run tsc` -- runs TypeScript compilation check. Takes ~2 seconds.
- `cd backend && poetry run python manage.py check --deploy` -- Django deployment checks. Takes ~2 seconds.
- `poetry run pre-commit install` -- installs pre-commit hooks. Takes ~1 second.

### Pre-commit and CI Requirements
ALWAYS run these commands before committing or the CI (.github/workflows/main.yml via proj_main.yml) will fail:
- `npm run lint`
- `poetry run ruff check ./backend/ --fix`
- `npm run tsc`
- `npm run test`
- `make test`

## Validation

### Manual Testing Requirements
ALWAYS manually validate any new code via these end-to-end scenarios after making changes:
- Start both development servers (`npm run dev` and `poetry run python manage.py runserver`)
- Navigate to `http://localhost:8000` and verify the React application loads
- Note: The app redirects HTTP to HTTPS by default - this is expected behavior
- Test the REST API check endpoint displayed on the home page
- Verify that API calls work properly between frontend and backend
- Check browser console for any JavaScript errors
- Test any new features you've implemented through the UI

### Testing User Scenarios
When adding new features, create tests that exercise:
- Backend: API endpoints using Django REST framework test client
- Frontend: React components using Jest and React Testing Library
- End-to-end: Manual browser testing to ensure UI and API integration works

## Common Issues and Solutions

### Build/Setup Issues
- If `poetry install` fails: ensure Python 3.12+ is installed
- If `npm install` fails: ensure Node.js 20+ is installed
- If migrations fail: check that local.py imports from local_base, not local
- If manage.py permission denied: run `chmod +x backend/manage.py`
- If frontend build warnings about TypeScript version: this is expected and safe to ignore

### Environment Configuration
- Backend uses SQLite by default for local development (configured in backend/.env)
- Frontend dev server runs on port 3000 but serves assets to Django on port 8000
- Django serves the full application - don't access port 3000 directly in browser
- App redirects HTTP to HTTPS by default (configured in local_base.py) - this is expected
- Sentry integration is preconfigured but optional for local development

## Repository Structure

### Key Backend Directories
- `backend/gold3/` -- Django project settings and main configuration
- `backend/users/` -- User management Django app with custom User model
- `backend/common/` -- Shared utilities and base test classes
- `backend/templates/` -- Django HTML templates (base.html is main entry point)
- `backend/schema.yml` -- Generated OpenAPI schema

### Key Frontend Directories  
- `frontend/js/` -- React TypeScript source code
- `frontend/js/api/` -- Generated TypeScript API client (auto-generated, don't edit)
- `frontend/js/pages/` -- React page components
- `frontend/sass/` -- SCSS stylesheets
- `frontend/webpack_bundles/` -- Built frontend assets (auto-generated, don't edit)

### Configuration Files
- `pyproject.toml` -- Python dependencies and Poetry configuration
- `package.json` -- Node.js dependencies and npm scripts
- `webpack.config.js` -- Frontend build configuration
- `.pre-commit-config.yaml` -- Pre-commit hooks configuration
- `proj_main.yml` -- GitHub Actions CI configuration (needs to be moved to .github/workflows/main.yml)

## Docker Alternative

This project supports Docker development via `docker-compose.yml`:
- `make docker_setup` -- initial Docker setup
- `make docker_up` -- start all services
- `make docker_down` -- stop all services
- Docker is optional - the non-Docker setup above is typically faster for development

## Important Notes

- The application uses Django to serve both API and frontend assets
- Frontend webpack dev server provides hot reloading but Django serves the actual app
- API schema and TypeScript client are auto-generated - always regenerate after backend changes
- Pre-commit hooks automatically run linting and schema updates
- Tests run in parallel for performance - this is normal and expected
- Some ESLint warnings about TypeScript version compatibility are expected and safe