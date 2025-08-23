# Production Deployment Guide

This guide covers production deployment strategies for the Gold3 application.

## Deployment Options

### 1. Container-Based Deployment (Recommended)

Using Docker containers provides consistency across environments:

```dockerfile
# Multi-stage production Dockerfile example
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY frontend/ ./frontend/
COPY webpack.config.js tsconfig.json ./
RUN npm run build

FROM python:3.13 AS backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --only=main --no-dev

# Copy application
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/webpack_bundles/ ./frontend/webpack_bundles/

# Collect static files
RUN DJANGO_SETTINGS_MODULE=gold3.settings.production \
    python backend/manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "gold3.wsgi:application"]
```

### 2. Platform-as-a-Service (PaaS)

#### Render.com (Configured)

The project includes `render.yaml` for easy Render deployment:

```yaml
services:
  - type: web
    name: gold3-web
    env: python
    buildCommand: "./render_build.sh"
    startCommand: "gunicorn gold3.wsgi:application"
    
databases:
  - name: gold3-db
    databaseName: gold3
    user: gold3
    
services:
  - type: redis
    name: gold3-redis
```

#### Heroku

For Heroku deployment:

```bash
# Procfile
web: gunicorn gold3.wsgi:application
worker: celery -A gold3 worker -l info
beat: celery -A gold3 beat -l info

# runtime.txt
python-3.13
```

### 3. Cloud Native (AWS/GCP/Azure)

#### AWS ECS with Fargate

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
    depends_on:
      - db
      - redis
      
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: gold3
      POSTGRES_USER: gold3
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      
  redis:
    image: redis:7-alpine
```

## Environment Configuration

### Production Settings

```python
# settings/production.py
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
        'CONN_MAX_AGE': 60,
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': config('REDIS_URL'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Static files
STATIC_ROOT = '/app/staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Celery
CELERY_BROKER_URL = config('REDIS_URL')
CELERY_RESULT_BACKEND = config('REDIS_URL')
```

### Environment Variables

```bash
# Production environment variables
SECRET_KEY=your-secure-secret-key
DATABASE_URL=postgresql://user:pass@host:port/dbname
REDIS_URL=redis://host:port/0
SENTRY_DSN=https://your-sentry-dsn
DJANGO_SETTINGS_MODULE=gold3.settings.production

# AWS (if using)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_S3_REGION_NAME=us-east-1

# Email
EMAIL_HOST=smtp.yourprovider.com
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

## Database Migration Strategy

### Zero-Downtime Migrations

1. **Backward-compatible migrations first**
2. **Deploy application code**
3. **Run cleanup migrations**

```bash
# Pre-deployment
python manage.py migrate --plan
python manage.py migrate

# Post-deployment (cleanup)
python manage.py migrate_cleanup
```

### Database Backup Strategy

```bash
# Automated backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql $DATABASE_URL < backup_file.sql
```

## Performance Optimization

### Frontend Optimization

- Code splitting with webpack
- Bundle optimization
- CDN for static assets
- Service worker for caching

### Backend Optimization

- Database query optimization
- Redis caching
- Celery for background tasks
- Connection pooling

## Monitoring and Logging

### Application Monitoring

```python
# settings/production.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=config('SENTRY_DSN'),
    integrations=[
        DjangoIntegration(),
        CeleryIntegration(),
    ],
    traces_sample_rate=0.1,
    profiles_sample_rate=0.1,
)
```

### Health Checks

```python
# health/views.py
from django.http import JsonResponse
from django.db import connections
from django.core.cache import cache

def health_check(request):
    health = {'status': 'healthy'}
    
    # Database check
    try:
        connections['default'].cursor()
        health['database'] = 'connected'
    except Exception as e:
        health['database'] = 'error'
        health['status'] = 'unhealthy'
    
    # Cache check
    try:
        cache.set('health_check', 'ok', 30)
        cache.get('health_check')
        health['cache'] = 'connected'
    except Exception as e:
        health['cache'] = 'error'
        health['status'] = 'unhealthy'
    
    return JsonResponse(health)
```

## Security Checklist

### Pre-Deployment Security

- [ ] Update all dependencies
- [ ] Run security audit (`npm audit`, `safety check`)
- [ ] Configure HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Configure CSP headers
- [ ] Enable security middleware
- [ ] Set secure session cookies
- [ ] Configure rate limiting

### Post-Deployment Security

- [ ] Monitor for vulnerabilities
- [ ] Regular security updates
- [ ] Log monitoring for attacks
- [ ] Backup verification
- [ ] Access log review

## Scaling Strategies

### Horizontal Scaling

- Load balancer configuration
- Multiple application instances
- Database read replicas
- CDN integration

### Vertical Scaling

- Resource monitoring
- Performance profiling
- Database optimization
- Cache tuning

## Rollback Strategy

### Quick Rollback

```bash
# Container rollback
docker service update --rollback service_name

# Code rollback
git revert <commit-hash>
git push origin main

# Database rollback (if needed)
psql $DATABASE_URL < previous_backup.sql
```

### Blue-Green Deployment

1. Deploy to green environment
2. Test green environment
3. Switch traffic to green
4. Keep blue as rollback option

This production deployment guide ensures reliable, secure, and scalable deployment of the Gold3 application.