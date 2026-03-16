import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import BleedText from '../BleedText';

const STATS = [
  { value: '18', label: 'Years Old' },
  { value: 'Infinite', label: 'Ideas' },
  { value: '1', label: 'Goal' },
];

export default function About() {
  const containerRef = useRef(null);

  // CTA Button Hover State
  const ctaBtnRef = useRef(null);
  const [ctaHoverData, setCtaHoverData] = useState({ x: 0, y: 0, hover: false });

  const handleCtaMouseEnter = (e) => {
    if (!ctaBtnRef.current) return;
    const rect = ctaBtnRef.current.getBoundingClientRect();
    setCtaHoverData({ x: e.clientX - rect.left, y: e.clientY - rect.top, hover: true });
  };

  const handleCtaMouseLeave = (e) => {
    if (!ctaBtnRef.current) return;
    const rect = ctaBtnRef.current.getBoundingClientRect();
    setCtaHoverData({ x: e.clientX - rect.left, y: e.clientY - rect.top, hover: false });
  };

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the motion
  const springConfig = { damping: 20, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to small translation (opposite direction)
  // We'll move it by max 15px in each direction
  const translateX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="about"
      className="relative"
      style={{ paddingBottom: '8rem' }}
    >
      <BleedText text="ABOUT" align="right" />

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem) 0' }}
      >
        {/* Left — portrait */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Portrait frame with organic clip-path */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              width: '100%',
              maxWidth: '460px',
              aspectRatio: '3/4',
              background: 'linear-gradient(135deg, #344021 0%, #1e280f 60%, #252618 100%)',
              clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
              border: '1px solid rgba(166,143,31,0.2)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'none', // Optional: could hide cursor for a more immersive feel, but sticking to standard
            }}
          >
            {/* Profile Image with reactive motion */}
            <motion.img
              src="/profile.png"
              alt="Portrait"
              style={{
                x: translateX,
                y: translateY,
                scale: 1.1, // Slight base scale up so we don't see edges during movement
              }}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-opacity duration-700"
            />
            {/* Inner glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 35% 40%, rgba(166,143,31,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            {/* Simulated grain texture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.12,
                pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '120px',
              }}
            />
            {/* Name overlay at bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                zIndex: 5,
              }}
            >
              <p className="font-monument text-xs tracking-widest drop-shadow-md" style={{ color: '#F2E6DF' }}>
                CREATIVE DIRECTOR
              </p>
            </div>
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card absolute bottom-[-2rem] right-4 lg:right-[-2rem] px-6 py-4 rounded-xl"
            style={{ padding: '1rem' }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center justify-between gap-4 mb-2 last:mb-0" style={{ paddingBottom: i === STATS.length - 1 ? '0' : '0.75rem' }}>
                <span
                  style={{ fontFamily: "'Climate Crisis', cursive", fontSize: '1rem', color: '#A68F1F', lineHeight: 1 }}
                >
                  {s.value}
                </span>
                <span
                  className="font-sans-body text-xs pb-0.5 opacity-50"
                  style={{ color: '#F2E6DF' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-7 pt-8 lg:pt-0"
        >
          <p
            className="font-editorial"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: '#F2E6DF',
              fontStyle: 'italic',
              lineHeight: 1.4,
            }}
          >
            "I believe design is the act of <span style={{ color: '#A68F1F' }}>translating feeling</span> into form — and that the best work lives at the edge of discomfort."
          </p>

          <p
            className="font-sans-body text-sm leading-relaxed"
            style={{ color: 'rgba(242,230,223,0.52)' }}
          >
            Based between Berlin and Lisbon, I'm a multidisciplinary creative director working at the intersection of brand identity, motion design, and digital experience. My work is driven by restraint, atmosphere, and intention.
          </p>

          <p
            className="font-sans-body text-sm leading-relaxed"
            style={{ color: 'rgba(242,230,223,0.52)' }}
          >
            I've collaborated with studios, labels, and fashion houses across Europe and North America — always asking the same question: what does this feel like?
          </p>

          <div className="flex items-center gap-4 ml-auto">
            <motion.button
              ref={ctaBtnRef}
              onMouseEnter={handleCtaMouseEnter}
              onMouseLeave={handleCtaMouseLeave}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold rounded-full text-xs shrink-0 whitespace-nowrap relative overflow-hidden group transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '0.75rem', paddingBottom: '0.75rem',
                background: 'transparent'
              }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#252618]">
                Start a Project
              </span>

              <motion.div
                className="absolute bg-[#A68F1F] rounded-full pointer-events-none"
                style={{
                  width: '450px',
                  height: '450px',
                  translateX: '-50%',
                  translateY: '-50%',
                  left: ctaHoverData.x,
                  top: ctaHoverData.y,
                  zIndex: 0,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: ctaHoverData.hover ? 1 : 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section >
  );
}
