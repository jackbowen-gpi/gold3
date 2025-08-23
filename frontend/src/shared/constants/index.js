"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.ERROR_MESSAGES = exports.APP_CONSTANTS = exports.AUTH_CONSTANTS = exports.API_CONFIG = void 0;
// API configuration
exports.API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' ? '/api' : '/api',
    VERSION: 'v1',
    TIMEOUT: 10000,
};
// Authentication constants
exports.AUTH_CONSTANTS = {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    USER_KEY: 'user_data',
};
// Application constants
exports.APP_CONSTANTS = {
    NAME: 'Gold3 Application',
    VERSION: '1.0.0',
    DEFAULT_PAGE_SIZE: 10,
};
// Error messages
exports.ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error occurred. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
};
// HTTP status codes
exports.HTTP_STATUS = {
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
