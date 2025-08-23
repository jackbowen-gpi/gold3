
// API configuration constants
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === "production" ? "/api" : "/api",
  VERSION: "v1",
  TIMEOUT: 10000,
};

// Authentication-related constants
export const AUTH_CONSTANTS = {
  TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  USER_KEY: "user_data",
};

// Application-wide constants
export const APP_CONSTANTS = {
  NAME: "Gold3 Application",
  VERSION: "1.0.0",
  DEFAULT_PAGE_SIZE: 10,
};

// Standard error messages for user feedback
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
};

// Common HTTP status codes for API responses
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};