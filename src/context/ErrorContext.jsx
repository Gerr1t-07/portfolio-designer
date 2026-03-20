import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

export const ErrorContext = createContext(null);

/**
 * Error Provider Component
 * Manages global error state and toast notifications
 */
export function ErrorProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({
      type = 'info', // 'info', 'success', 'warning', 'error'
      message = '',
      duration = 3000,
    }) => {
      const id = `toast_${Date.now()}_${Math.random()}`;

      setToasts(prev => [...prev, { id, type, message, duration }]);

      // Auto-remove after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);

        return () => clearTimeout(timer);
      }
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" style={{ margin: '1rem'}}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
}

export default ErrorProvider;
