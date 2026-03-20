import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast Notification Component
 * Displays temporary notifications to the user
 */
export default function Toast({ id, type = 'info', message, onClose }) {
  const iconMap = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const colorMap = {
    info: 'bg-blue-900/30 border-blue-500/50 text-blue-200',
    success: 'bg-green-900/30 border-green-500/50 text-green-200',
    warning: 'bg-yellow-900/30 border-yellow-500/50 text-yellow-200',
    error: 'bg-red-900/30 border-red-500/50 text-red-200',
  };

  const Icon = iconMap[type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ duration: 0.3, opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm select-none
        ${colorMap[type]}
        max-w-sm shadow-lg
      `}
      style={{ padding: '0.75rem'}}
      role="alert"
    >
      <Icon className="shrink-0 w-5 h-5 mt-0.5" />
      <p className="flex-1 text-sm leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 text-current hover:opacity-70 transition-opacity hover:cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
