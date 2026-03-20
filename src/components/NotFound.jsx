import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import HoverFillButton from './HoverFillButton';
import errorHandler, { ErrorCategory, ErrorSeverity } from '../lib/errorHandler';

/**
 * 404 Not Found Page
 * Displays when a user navigates to a non-existent route or resource
 * Styled to match portfolio aesthetic with interactive fallback content
 */
export default function NotFound({ onNavigate }) {
  const [displayNumber, setDisplayNumber] = useState('0');
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate the 404 number display
  useEffect(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    let current = 4;
    const target = 404;
    const increment = 50;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        setIsAnimating(false);
      }
      setDisplayNumber(String(current));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (destination) => {
    try {
      if (onNavigate) {
        onNavigate(destination);
      } else {
        // Fallback to browser history
        if (destination === 'back') {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      errorHandler.log(
        err instanceof Error ? err : new Error(String(err)),
        ErrorCategory.RUNTIME_ERROR,
        ErrorSeverity.LOW,
        { action: 'navigate_from_404', destination }
      );
    }
  };

  return (
    <div
      className="relative min-h-screen bg-bg text-cream overflow-hidden flex items-center justify-center"
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 grain-overlay pointer-events-none"
        aria-hidden="true"
      />

      {/* Animated background blur */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        animate={{
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.15, 0.25, 0.15, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(166,143,31,0.4) 0%, transparent 70%)',
          filter: 'blur(120px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6"
        style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem'}}
      >
        {/* Large animated 404 number */}
        <motion.div
          className="font-display text-9xl md:text-[12rem] leading-none select-none"
          style={{
            color: '#A68F1F',
            letterSpacing: '-0.03em',
            textShadow: '0 0 60px rgba(166, 143, 31, 0.3)',
            marginBottom: '1rem'
          }}
        >
          <motion.span
            key={displayNumber}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {displayNumber}
          </motion.span>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100px' }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="h-px bg-linear-to-r from-transparent via-gold to-transparent mb-8"
          style={{ background: 'linear-gradient(to right, transparent, #A68F1F, transparent)', marginLeft: 'auto', marginRight: 'auto', marginBottom: '2rem' }}
        />

        {/* Headings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginBottom: '1.5rem'}}
        >
          <h1
            className="font-display text-4xl md:text-5xl leading-tight"
            style={{ letterSpacing: '-0.025em', color: '#F2E6DF', marginBottom: '0.75rem' }}
          >
            Page Not Found
          </h1>
          <p
            className="font-sans-body text-lg md:text-xl"
            style={{ color: 'rgba(242, 230, 223, 0.6)' }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-sans-body text-sm md:text-base max-w-md"
          style={{ color: 'rgba(242, 230, 223, 0.5)', marginBottom: '2.5rem', marginLeft: 'auto', marginRight: 'auto' }}
        >
          This could be a result of a broken link, a typo in the URL, or the page may have
          been removed. Let's get you back on track.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <HoverFillButton
            onClick={() => handleNavigate('back')}
            className="border uppercase px-6 py-3 flex items-center gap-2"
            style={{
              borderColor: 'rgba(166, 143, 31, 0.5)',
              color: '#A68F1F',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </HoverFillButton>

          <HoverFillButton
            inverted
            onClick={() => handleNavigate('home')}
            className="border border-gold uppercase flex items-center gap-2"
            style={{
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
            }}
          >
            <Home size={16} />
            Return Home
          </HoverFillButton>
        </motion.div>

        {/* Easter egg text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="font-editorial text-xs md:text-sm mt-12"
          style={{ color: 'rgba(166, 143, 31, 0.3)', fontStyle: 'italic', marginTop: '0.5rem' }}
        >
          Error Code: 404 • Missing Page Found
        </motion.p>
      </motion.div>
    </div>
  );
}
