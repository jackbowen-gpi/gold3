"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = exports.getErrorMessage = exports.debounce = exports.truncateText = exports.capitalize = exports.isValidEmail = exports.formatDate = void 0;
/**
 * Utility function to format dates consistently across the application
 */
const formatDate = (date, format = 'short') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString();
        case 'long':
            return dateObj.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        case 'relative':
            return new Intl.RelativeTimeFormat().format(Math.round((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 'day');
        default:
            return dateObj.toLocaleDateString();
    }
};
exports.formatDate = formatDate;
/**
 * Utility function to validate email addresses
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Utility function to capitalize first letter of a string
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
/**
 * Utility function to truncate text with ellipsis
 */
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trim() + '...';
};
exports.truncateText = truncateText;
/**
 * Utility function to debounce function calls
 */
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
exports.debounce = debounce;
/**
 * Utility function to get error message from various error types
 */
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }
    return 'An unknown error occurred';
};
exports.getErrorMessage = getErrorMessage;
/**
 * Utility function to generate URL-friendly slugs
 */
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
exports.slugify = slugify;
