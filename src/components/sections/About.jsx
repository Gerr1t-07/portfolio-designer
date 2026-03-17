import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import BleedText from '../BleedText';
import HoverFillButton from './HoverFillButton';

const STATS = [
  { value: '18', label: 'Age' },
  { value: 'Germany', label: 'Location' },
  { value: '5+ Years', label: 'Creating since' },
];

export default function About() {
  const containerRef = useRef(null);

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
      style={{ paddingBottom: '4rem' }}
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
            <div className="absolute bottom-4 md:bottom-6 left-3 md:left-6 z-5"
            >
              <p className="font-display text-[0.7rem] md:text-xs tracking-widest drop-shadow-md text-cream">
                GRAPHIC DESIGNER
              </p>
            </div>
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card absolute -bottom-8 -right-2 lg:right-24 rounded-xl"
            style={{ padding: '1rem' }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center justify-between gap-4 mb-2 last:mb-0 font-display text-xs md:text-[1rem] text-gold" style={{ paddingBottom: i === STATS.length - 1 ? '0' : '0.75rem' }}>
                <span
                  className="font-sans-body text-[0.7rem] md:text-xs pb-0.5 opacity-80 text-cream"
                >
                  {s.label}
                </span>
                <span>
                  {s.value}
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
          className="flex flex-col gap-7 pt-8 lg:pt-0 text-left"
        >
          <p
            className="font-editorial text-cream"
            style={{
              fontSize: 'clamp(2.2rem, 3vw, 3.5rem)',
              lineHeight: 1.1,
            }}
          >
            <span className='text-gold'>Graphic Designer</span> who builds brands worth remembering.
          </p>

          <p
            className="font-sans-body text-sm leading-relaxed"
            style={{ color: 'rgba(242,230,223,0.52)' }}
          >
            Located in Germany, I create visual identities, graphics, and photo-realistic<br />3D assets. I work with start-ups, artists, and anyone who needs a visual presence that actually means something.<br/><br/>
            My work is driven by emotion and atmosphere. Every project has a concept behind it, and execution that reflects it. Whether that's a brand identity<br />built from scratch, a poster that stops someone mid-scroll, or a<br />3D render with the weight of a real object.<br/><br/>
            I'm young, focused, and constantly pushing the work forward.<br />There's no project too early-stage or too ambitious."
          </p>

          <div className="flex items-end justify-end md:justify-start gap-4 ml-auto h-12 md:h-16">
            <HoverFillButton
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 w-[180px] h-12 border"
            >
                Start a Project
            </HoverFillButton>
          </div>
        </motion.div>
      </div>
    </section >
  );
}
