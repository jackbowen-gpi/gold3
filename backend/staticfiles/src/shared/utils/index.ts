/**
 * Utility function to format dates consistently across the application
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
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
      return new Intl.RelativeTimeFormat().format(
        Math.round((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        'day'
      );
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Utility function to validate email addresses
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Utility function to capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Utility function to truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Utility function to debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Utility function to get error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
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

/**
 * Utility function to generate URL-friendly slugs
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};