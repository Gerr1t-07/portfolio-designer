/**
 * Logger Utility
 * Development-friendly logging with automatic environment detection
 * Provides different behavior for dev vs production
 */

const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  constructor() {
    this.isDev = isDevelopment;
    this.enabledInProduction = ['error', 'warn']; // Only log errors/warnings in production
  }

  /**
   * Log information
   * @param {...args} args - Values to log
   */
  log(...args) {
    if (this.isDev) {
      console.log('[LOG]', ...args);
    }
  }

  /**
   * Log debug information
   * @param {...args} args - Values to log
   */
  debug(...args) {
    if (this.isDev) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * Log information
   * @param {...args} args - Values to log
   */
  info(...args) {
    if (this.isDev) {
      console.info('[INFO]', ...args);
    } else {
      // Could send to analytics in production
      this._trackEvent('info', args);
    }
  }

  /**
   * Log warning (shown in both dev and production)
   * @param {...args} args - Values to log
   */
  warn(...args) {
    console.warn('[WARN]', ...args);
    if (!this.isDev) {
      this._trackEvent('warn', args);
    }
  }

  /**
   * Log error (shown in both dev and production)
   * @param {...args} args - Values to log
   */
  error(...args) {
    console.error('[ERROR]', ...args);
    if (!this.isDev) {
      this._trackEvent('error', args);
    }
  }

  /**
   * Log with timestamp (useful for performance debugging)
   * @param {string} label - Label for the log
   * @param {*} value - Value to log
   */
  time(label, value) {
    if (this.isDev) {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      });
      console.log(`%c[${timestamp}] ${label}`, 'color: #8b7b1a; font-weight: bold;', value);
    }
  }

  /**
   * Log group (development only)
   * @param {string} groupLabel - Label for the group
   * @param {Function} callback - Callback to execute within group
   */
  group(groupLabel, callback) {
    if (this.isDev) {
      console.group(groupLabel);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    } else {
      callback();
    }
  }

  /**
   * Log table (development only)
   * @param {Array|Object} data - Data to display as table
   * @param {string} label - Optional label
   */
  table(data, label = 'Table') {
    if (this.isDev) {
      console.log(`%c━━━ ${label} ━━━`, 'color: #8b7b1a; font-weight: bold;');
      console.table(data);
    }
  }

  /**
   * Create a performance marker (development only)
   * @param {string} markerName - Name of the marker
   */
  mark(markerName) {
    if (this.isDev && typeof performance !== 'undefined') {
      performance.mark(markerName);
    }
  }

  /**
   * Measure time between two markers (development only)
   * @param {string} measureName - Name of the measurement
   * @param {string} startMark - Start marker name
   * @param {string} endMark - End marker name
   */
  measure(measureName, startMark, endMark) {
    if (this.isDev && typeof performance !== 'undefined') {
      try {
        performance.measure(measureName, startMark, endMark);
        const entries = performance.getEntriesByName(measureName);
        if (entries.length > 0) {
          this.time(measureName, `${entries[0].duration.toFixed(2)}ms`);
        }
      } catch (err) {
        this.error('Measure error:', err);
      }
    }
  }

  // ─── Private Methods ──────────────────────────────────────────────────────

  _trackEvent(level, args) {
    // Placeholder for analytics integration
    // Could send to analytics service like Mixpanel, Google Analytics, etc.
    // this.analyticsService?.trackEvent('console_log', { level, args });
  }
}

export const logger = new Logger();

export default logger;
