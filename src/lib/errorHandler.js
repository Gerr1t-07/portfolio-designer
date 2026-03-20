/**
 * Error Handler Utility
 * Centralized error tracking, logging, and reporting system
 * Extensible for future integration with Sentry, LogRocket, or other services
 */

const isDevelopment = import.meta.env.MODE === 'development';

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',      // Non-critical, graceful fallback available (e.g., failed image)
  MEDIUM: 'medium', // Recoverable error affecting functionality (e.g., form submission)
  HIGH: 'high',    // Critical error (e.g., broken component, runtime error)
};

// Error categories for better organization
export const ErrorCategory = {
  ASSET_LOADING: 'asset_loading',    // SVGs, images, fonts
  EXTERNAL_SERVICE: 'external_service', // Social links, external APIs
  FORM_VALIDATION: 'form_validation',  // Input validation, missing data
  RUNTIME_ERROR: 'runtime_error',     // JavaScript errors, null references
  ANIMATION: 'animation',             // Framer Motion, animation errors
  SCROLL: 'scroll',                   // Scroll events, refs
};

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.listeners = [];
    this.maxLogSize = 100; // Keep last 100 errors in memory
  }

  /**
   * Log an error with full context
   * @param {Error|string} error - Error object or message
   * @param {string} category - Error category (from ErrorCategory)
   * @param {string} severity - Severity level (from ErrorSeverity)
   * @param {Object} context - Additional context object
   * @returns {string} Error ID for tracking
   */
  log(error, category = ErrorCategory.RUNTIME_ERROR, severity = ErrorSeverity.MEDIUM, context = {}) {
    const errorId = this._generateErrorId();
    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const errorRecord = {
      id: errorId,
      timestamp,
      message,
      stack,
      category,
      severity,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    // Add to log
    this.errorLog.push(errorRecord);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift(); // Remove oldest error if exceeding max size
    }

    // Console output in development
    if (isDevelopment) {
      this._logToConsole(errorRecord);
    }

    // Notify listeners (for toast/UI feedback)
    this._notifyListeners(errorRecord);

    // Send to external service if configured
    this._sendToExternalService(errorRecord);

    return errorId;
  }

  /**
   * Catch and handle async errors
   * @param {Promise} promise - Promise to wrap
   * @param {string} operationName - Name of the operation for logging
   * @param {Object} options - { category, severity, context }
   * @returns {Promise}
   */
  async catchAsync(promise, operationName = 'Async Operation', options = {}) {
    try {
      return await promise;
    } catch (error) {
      const {
        category = ErrorCategory.RUNTIME_ERROR,
        severity = ErrorSeverity.MEDIUM,
        context = {},
      } = options;

      this.log(error, category, severity, {
        operationName,
        ...context,
      });

      // Return null to allow graceful degradation
      return null;
    }
  }

  /**
   * Subscribe to error events
   * Used by components to receive real-time error notifications
   * @param {Function} callback - Called with error record on new errors
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Get all logged errors
   * @returns {Array} Array of error records
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log (useful for debugging)
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get errors by severity
   * @param {string} severity - Severity level to filter
   * @returns {Array} Filtered error records
   */
  getErrorsBySeverity(severity) {
    return this.errorLog.filter(err => err.severity === severity);
  }

  /**
   * Get errors by category
   * @param {string} category - Category to filter
   * @returns {Array} Filtered error records
   */
  getErrorsByCategory(category) {
    return this.errorLog.filter(err => err.category === category);
  }

  /**
   * Register external error reporting service
   * Called once during app initialization
   * @param {Function} transportFn - Function to send errors (error) => Promise
   */
  registerExternalTransport(transportFn) {
    this._externalTransport = transportFn;
  }

  // ─── Private Methods ──────────────────────────────────────────────────────

  _generateErrorId() {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _logToConsole(errorRecord) {
    const { timestamp, severity, category, message, context } = errorRecord;
    const badge = `%c[${severity.toUpperCase()}]%c ${category}`;
    const severityColor = {
      low: 'color: #10b981; font-weight: bold;',
      medium: 'color: #f59e0b; font-weight: bold;',
      high: 'color: #ef4444; font-weight: bold;',
    }[severity] || 'color: gray;';

    console.group(badge, severityColor, 'color: reset');
    console.log(`Time: ${timestamp}`);
    console.log(`Message: ${message}`);
    if (Object.keys(context).length > 0) {
      console.log('Context:', context);
    }
    console.groupEnd();
  }

  _notifyListeners(errorRecord) {
    this.listeners.forEach(callback => {
      try {
        callback(errorRecord);
      } catch (err) {
        // Prevent listener errors from breaking the system
        console.error('Error in error handler listener:', err);
      }
    });
  }

  _sendToExternalService(errorRecord) {
    if (this._externalTransport && !isDevelopment) {
      try {
        this._externalTransport(errorRecord).catch(err => {
          console.error('Failed to send error to external service:', err);
        });
      } catch (err) {
        console.error('External error transport failed:', err);
      }
    }
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

export default errorHandler;
