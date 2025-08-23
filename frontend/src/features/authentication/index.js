// Export authentication hooks and services using ES module syntax for better compatibility and readability

// Export the custom authentication hook
export { useAuth } from "./hooks/useAuth";

// Export the authentication service for API calls
export { AuthService } from "./services/AuthService";

// When you create authentication-related components, export them here for easy access throughout your app
// Example:
// export { LoginForm } from './components/LoginForm';
// export { RegisterForm } from './components/RegisterForm';