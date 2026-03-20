import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorCategory, ErrorSeverity } from '../lib/errorHandler';

export default function Preloader({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeStage, setActiveStage] = useState(1);
  const [logoFailed, setLogoFailed] = useState(false);
  const [treeFailed, setTreeFailed] = useState(false);
  const { catchError } = useErrorHandler();

  useEffect(() => {
    // Simulate progress → 100 over ~4.5s so the tree has time to grow
    const start = performance.now();
    const duration = 3000;

    const tick = () => {
      const elapsed = performance.now() - start;
      const progressFraction = Math.min(1, elapsed / duration);

      let p;
      if (progressFraction <= 0.3333) {
        // First 33.33% (1/3) of time: go from 0 to 99
        const localFraction = progressFraction / 0.3333; // 0 to 1
        p = localFraction * 99;
      } else {
        // Last 66.66% (2/3) of time: go from 99 to 100
        const localFraction = (progressFraction - 0.3333) / 0.6667; // 0 to 1
        p = 99 + (localFraction * 1);
      }

      setProgress(Math.round(p));

      if (progressFraction < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 400);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  // Tree growth loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => (prev === 4 ? 1 : prev + 1));
    }, 950); // ~1.1s per stage
    return () => clearInterval(interval);
  }, []);

  const handleLogoError = () => {
    catchError(
      new Error('Preloader logo failed to load'),
      {
        category: ErrorCategory.ASSET_LOADING,
        severity: ErrorSeverity.LOW,
        context: { assetType: 'logo', src: '/Logo.png' },
      }
    );
    setLogoFailed(true);
  };

  const handleTreeError = () => {
    catchError(
      new Error(`Tree stage ${activeStage} failed to load`),
      {
        category: ErrorCategory.ASSET_LOADING,
        severity: ErrorSeverity.LOW,
        context: { assetType: 'tree_stage', stage: activeStage, src: `/tree_stage_${activeStage}.svg` },
      }
    );
    setTreeFailed(true);
  };

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: '#1a1e0e',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            {!logoFailed ? (
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-3 w-auto object-contain"
                style={{ filter: 'brightness(1) invert(0) opacity(1)' }}
                onError={handleLogoError}
              />
            ) : (
              <span
                className="font-sans-body text-xs tracking-widest uppercase"
                style={{ color: 'rgba(166,143,31,0.6)' }}
              >
                SACHER
              </span>
            )}
          </div>

          {/* Custom SVG Tree Crossfade Animation */}
          <div className="relative w-16 h-20 mt-6 mb-2 flex items-end justify-center">
            {!treeFailed ? (
              <AnimatePresence>
                <motion.img
                  key={activeStage}
                  src={`/tree_stage_${activeStage}.svg`}
                  alt="Growing Tree"
                  className="absolute w-full h-full object-contain"
                  style={{
                    originY: 1,
                    filter: 'brightness(0) invert(1) opacity(0.6)'
                  }}
                  initial={{ opacity: 0, scale: [0.2, 0.4, 0.8, 1][activeStage - 1] }}
                  animate={{ opacity: 1, scale: [0.2, 0.4, 0.8, 1][activeStage - 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  onError={handleTreeError}
                />
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex items-center justify-center"
                style={{ color: 'rgba(166,143,31,0.6)' }}
              >
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              </motion.div>
            )}
          </div>

          <div
            className="font-sans-body flex gap-2 items-center"
            style={{ color: 'rgba(166,143,31,0.6)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
          >
            <span className="uppercase">Loading</span>
            <span>{progress}%</span>
          </div>

          {/* Tagline */}
          <p
            className="font-editorial"
            style={{
              color: 'rgba(242,230,223,0.25)',
              fontSize: '0.85rem',
              fontStyle: 'italic',
              marginTop: '0.5rem',
            }}
          >
            Growing Ideas…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


