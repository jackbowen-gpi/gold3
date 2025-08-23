"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = exports.getErrorMessage = exports.debounce = exports.truncateText = exports.capitalize = exports.isValidEmail = exports.formatDate = void 0;
/**
 * Utility function to format dates consistently across the application
 */
var formatDate = function (date, format) {
    if (format === void 0) { format = 'short'; }
    var dateObj = typeof date === 'string' ? new Date(date) : date;
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
var isValidEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Utility function to capitalize first letter of a string
 */
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
/**
 * Utility function to truncate text with ellipsis
 */
var truncateText = function (text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trim() + '...';
};
exports.truncateText = truncateText;
/**
 * Utility function to debounce function calls
 */
var debounce = function (func, delay) {
    var timeoutId;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () { return func.apply(void 0, args); }, delay);
    };
};
exports.debounce = debounce;
/**
 * Utility function to get error message from various error types
 */
var getErrorMessage = function (error) {
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
var slugify = function (text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
exports.slugify = slugify;
