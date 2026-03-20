import { useCallback, useContext } from 'react';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../lib/errorHandler';
import { ErrorContext } from '../context/ErrorContext';

/**
 * Custom hook for unified error handling in components
 * Provides methods for logging, catching, and displaying errors
 * @returns {Object} Object with error handling methods
 */
export function useErrorHandler() {
  const { showToast } = useContext(ErrorContext) || {};

  /**
   * Catch an error and handle it appropriately
   * @param {Error|string} error - Error object or message
   * @param {Object} options - { category, severity, message, showToast }
   * @returns {string} Error ID
   */
  const catchError = useCallback(
    (error, options = {}) => {
      const {
        category = ErrorCategory.RUNTIME_ERROR,
        severity = ErrorSeverity.MEDIUM,
        message = null,
        showToastMessage = null,
        context = {},
      } = options;

      // Log to error handler
      const errorId = errorHandler.log(error, category, severity, context);

      // Show user feedback if specified and toast function is available
      if (showToastMessage && showToast) {
        showToast({
          type: severity === ErrorSeverity.HIGH ? 'error' : 'warning',
          message: showToastMessage,
          duration: severity === ErrorSeverity.HIGH ? 5000 : 3000,
        });
      }

      return errorId;
    },
    [showToast]
  );

  /**
   * Wrap async operations with error handling
   * @param {Function} asyncFn - Async function to wrap
   * @param {Object} options - { category, severity, message, showToast }
   * @returns {Function} Wrapped async function
   */
  const withAsyncErrorHandling = useCallback(
    (asyncFn, options = {}) => {
      return async (...args) => {
        try {
          return await asyncFn(...args);
        } catch (error) {
          catchError(error, {
            ...options,
            context: { args, ...options.context },
          });
          return null;
        }
      };
    },
    [catchError]
  );

  /**
   * Wrap sync callbacks with error handling
   * @param {Function} callback - Callback to wrap
   * @param {Object} options - { category, severity, message, showToast }
   * @returns {Function} Wrapped callback
   */
  const withErrorHandling = useCallback(
    (callback, options = {}) => {
      return (...args) => {
        try {
          return callback(...args);
        } catch (error) {
          catchError(error, {
            ...options,
            context: { args, ...options.context },
          });
        }
      };
    },
    [catchError]
  );

  /**
   * Validate and log specific conditions
   * @param {boolean} condition - Condition to check
   * @param {string} message - Message if condition is false
   * @param {Object} options - { category, severity, showToast }
   * @returns {boolean} Whether condition is true
   */
  const assert = useCallback(
    (condition, message, options = {}) => {
      if (!condition) {
        catchError(
          new Error(message),
          {
            category: options.category || ErrorCategory.RUNTIME_ERROR,
            severity: options.severity || ErrorSeverity.MEDIUM,
            showToastMessage: options.showToastMessage || message,
            context: options.context,
          }
        );
        return false;
      }
      return true;
    },
    [catchError]
  );

  return {
    catchError,
    withAsyncErrorHandling,
    withErrorHandling,
    assert,
  };
}

export default useErrorHandler;
