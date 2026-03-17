import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import HoverFillButton from './HoverFillButton';

const containerVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({ scrollTo }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Ballet:opsz@16..72&family=Climate+Crisis&display=swap');
        `}
      </style>
      <div
        className="absolute top-24 right-[50vw-w] md:top-10 md:right-10 font-display text-xs tracking-[0.18em] pointer-events-none"
        style={{ color: 'rgba(166,143,31,0.38)', zIndex: 20 }}
      >
        EST. 2026
      </div>

      {/* ── Main content — 2 columns ── */}
      <motion.div
        variants={containerVar}
        initial="hidden"
        animate="show"
        className="relative w-full h-full max-w-[1400px] mx-auto flex flex-col justify-center"
      >

        {/* Centered Text Content */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center text-center gap-10 px-6">

            {/* Main headline */}
            <motion.div variants={fadeUp} className="flex flex-col items-center pointer-events-none">
              <p
                variants={fadeUp}
                className="font-sans-body text-xs tracking-[0.28em] uppercase mb-4 text-gold"
              >
                VISUAL ARTIST & DESIGNER
              </p>
              <h1
                className="leading-[0.9] font-display text-cream"
                style={{
                  fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                  letterSpacing: '-0.025em'
                }}
              >
                DESIGN
              </h1>
              <p
                className="italic mt-2 md:mt-0 font-display text-cream"
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                }}
              >
                with purpose
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeUp} className="flex flex-col items-center pointer-events-auto">
              <HoverFillButton
                className="px-8 py-3 w-[180px] h-12 border"
                onClick={() => scrollTo('contact')}
              >
                GET IN TOUCH
              </HoverFillButton>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Jungle Frame Overlay ── */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/jungle-frame.png"
          alt=""
          className="w-full h-full object-cover md:block hidden"
        />
        <img src="/jungle-frame-mobile.png" alt="" className="w-full h-full object-cover md:hidden block" />
      </div>

      {/* ── Scroll indicator — pinned to bottom center ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        transition={{ delay: 1.6, duration: 0.8 }}
        onClick={() => scrollTo('work')}
        className="group absolute bottom-32 md:bottom-48 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-50 pointer-events-auto hover:scale-[1.05] active:scale-[0.95] transition-all duration-300"
        aria-label="Scroll to work"
      >
        <span className="font-sans-body text-[10px] tracking-[0.3em] uppercase mb-1 text-cream opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="group-hover:scale-110 transition-transform duration-300"
        >
          <ChevronDown size={22} strokeWidth={2.5} className="text-cream group-hover:text-white transition-colors duration-300" />
        </motion.div>
      </motion.button>
    </section>
  );
}
