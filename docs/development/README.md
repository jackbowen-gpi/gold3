# Development Guide

This guide helps developers understand how to work with this project's architecture.

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Poetry (for Python dependencies)
- PostgreSQL (for database)

### Setup

1. **Install dependencies:**
   ```bash
   # Python dependencies
   poetry install
   
   # Node.js dependencies
   npm install
   ```

2. **Environment setup:**
   ```bash
   # Copy environment template
   cp backend/gold3/settings/local.py.example backend/gold3/settings/local.py
   
   # Configure your database and other settings
   ```

3. **Database setup:**
   ```bash
   # Run migrations
   poetry run python backend/manage.py migrate
   
   # Create superuser
   poetry run python backend/manage.py createsuperuser
   ```

## Project Structure

### Backend Development

#### Adding a New Domain

1. Create domain directory:
   ```bash
   mkdir backend/domains/your_domain
   ```

2. Create domain structure:
   ```
   your_domain/
   ├── __init__.py
   ├── models.py        # Domain models
   ├── services.py      # Business logic
   ├── repositories.py  # Data access
   ├── serializers.py   # API serializers
   └── tests/          # Domain tests
   ```

3. Implement repository:
   ```python
   from domains.shared.repositories.base import BaseRepository
   from .models import YourModel
   
   class YourRepository(BaseRepository[YourModel]):
       def get_model_class(self):
           return YourModel
   ```

4. Implement service:
   ```python
   from domains.shared.services.base import BaseService
   from .repositories import YourRepository
   from .models import YourModel
   
   class YourService(BaseService[YourModel]):
       def __init__(self):
           super().__init__(YourRepository())
       
       def get_model_class(self):
           return YourModel
   ```

#### Adding API Endpoints

1. Create views in your domain
2. Add URLs to `api/v1/urls.py`
3. Update API documentation

### Frontend Development

#### Adding a New Feature

1. Create feature directory:
   ```bash
   mkdir frontend/src/features/your_feature
   ```

2. Create feature structure:
   ```
   your_feature/
   ├── components/      # Feature-specific components
   ├── hooks/          # Feature-specific hooks
   ├── services/       # API calls for this feature
   ├── types/          # TypeScript types
   ├── utils/          # Feature utilities
   └── __tests__/      # Feature tests
   ```

3. Export from feature index:
   ```typescript
   // frontend/src/features/your_feature/index.ts
   export { default as YourFeatureComponent } from './components/YourFeatureComponent';
   export * from './hooks';
   export * from './types';
   ```

#### Shared Components

Create reusable components in `frontend/src/shared/components/`:

```typescript
// Example: frontend/src/shared/components/Button/Button.tsx
import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}) => {
  return (
    <button
      className={classNames('btn', `btn-${variant}`, `btn-${size}`)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## Testing Guidelines

### Backend Testing

1. **Unit Tests**: Test services and repositories
   ```python
   # tests/unit/test_your_service.py
   from unittest.mock import Mock
   from domains.your_domain.services import YourService
   
   def test_your_service_method():
       service = YourService()
       service.repository = Mock()
       # Test your service logic
   ```

2. **Integration Tests**: Test API endpoints
   ```python
   # tests/integration/test_your_api.py
   from rest_framework.test import APITestCase
   
   class YourAPITestCase(APITestCase):
       def test_endpoint(self):
           response = self.client.get('/api/v1/your-endpoint/')
           self.assertEqual(response.status_code, 200)
   ```

### Frontend Testing

1. **Component Tests**:
   ```typescript
   // features/your_feature/__tests__/YourComponent.test.tsx
   import { render, screen } from '@testing-library/react';
   import { YourComponent } from '../components/YourComponent';
   
   test('renders your component', () => {
     render(<YourComponent />);
     expect(screen.getByText('Expected Text')).toBeInTheDocument();
   });
   ```

2. **Hook Tests**:
   ```typescript
   // shared/hooks/__tests__/useYourHook.test.ts
   import { renderHook } from '@testing-library/react-hooks';
   import { useYourHook } from '../useYourHook';
   
   test('your hook works correctly', () => {
     const { result } = renderHook(() => useYourHook());
     expect(result.current).toBeDefined();
   });
   ```

## Code Style and Standards

### Backend

- Follow PEP 8 for Python code style
- Use type hints for all function parameters and return values
- Write docstrings for all public methods
- Use Ruff for linting and formatting

### Frontend

- Follow the project's ESLint configuration
- Use TypeScript for all new code
- Write JSDoc comments for complex functions
- Use descriptive variable and function names

## Common Patterns

### Error Handling

Backend:
```python
from domains.shared.exceptions.base import NotFoundError, ValidationError

def your_service_method(self, user_id: int):
    if not self.repository.exists(id=user_id):
        raise NotFoundError("User", str(user_id))
```

Frontend:
```typescript
try {
  const data = await api.getData();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Failed to fetch data:', error);
}
```

### State Management

Use React hooks for local state and context for shared state:

```typescript
// Context for shared state
const AppContext = createContext();

// Custom hook for accessing context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

## Deployment

See the deployment documentation for detailed deployment instructions.