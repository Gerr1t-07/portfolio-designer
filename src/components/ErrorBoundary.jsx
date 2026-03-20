import React from 'react';
import { logger } from '../lib/logger';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../lib/errorHandler';

/**
 * Error Boundary Component
 * Catches React rendering errors and displays fallback UI
 * Allows the app to continue functioning even if a component crashes
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    logger.error('Error Boundary caught:', error, errorInfo);

    // Report to error handler
    errorHandler.log(error, ErrorCategory.RUNTIME_ERROR, ErrorSeverity.HIGH, {
      componentStack: errorInfo.componentStack,
    });

    // Update state
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="relative min-h-screen bg-bg text-cream flex items-center justify-center p-6"
          style={{ background: '#1a1e0e' }}
        >
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(239, 68, 68, 0.1)' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: '#ef4444' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-display mb-2 text-cream">
                Something went wrong
              </h1>
              <p className="text-sm text-cream/60 leading-relaxed">
                We encountered an unexpected error. The issue has been logged and our
                team has been notified. Please try refreshing the page.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.MODE === 'development' && this.state.error && (
              <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                <p className="text-xs font-mono text-red-200 wrap-break-word">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-3 cursor-pointer">
                    <summary className="text-xs text-red-300 hover:text-red-200">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-[10px] text-red-200 overflow-auto max-h-40 whitespace-pre-wrap wrap-break-word">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 rounded-lg font-sans-body text-sm font-semibold transition-all"
                style={{
                  background: '#A68F1F',
                  color: '#1a1e0e',
                }}
                onMouseEnter={e => (e.target.style.opacity = '0.9')}
                onMouseLeave={e => (e.target.style.opacity = '1')}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 px-4 py-2 rounded-lg font-sans-body text-sm font-semibold border transition-all"
                style={{
                  borderColor: 'rgba(166, 143, 31, 0.5)',
                  color: '#A68F1F',
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(166, 143, 31, 0.1)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
