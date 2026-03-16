import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { useRef, useState } from 'react';
import TikTok from '@/assets/icons/TikTok Icon.svg?react';
import Instagram from '@/assets/icons/Instagram Icon.svg?react';
import Dribbble from '@/assets/icons/Dribbble Icon.svg?react';
import Fiverr from '@/assets/icons/Fiverr Icons.svg?react';
import Twitter from '@/assets/icons/X Icons.svg?react';
import LinkedIn from '@/assets/icons/LinkedIn Icon.svg?react';


const SOCIALS = [
  { icon: TikTok, label: 'TikTok', href: 'https://www.tiktok.com/@gstudio026' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/gstudio026' },
  { icon: Dribbble, label: 'Dribbble', href: 'https://dribbble.com/sachergerrit' },
  { icon: Fiverr, label: 'Fiverr', href: 'https://de.fiverr.com/s/381GWRk' },
  { icon: Twitter, label: 'X', href: 'x.com' },
  { icon: LinkedIn, label: 'LinkedIn', href: 'linkedin.com' }
];

export default function ContactFooter() {
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
  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #252618 0%, #1a1e0e 100%)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 4rem) 2rem',
      }}
    >
      {/* Gold border top */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #A68F1F55, transparent)' }}
      />

      {/* Background text */}
      <div
        className="pointer-events-none select-none absolute bottom-38 md:bottom-0 inset-y-0 flex items-center justify-center w-screen overflow-hidden left-0"
        aria-hidden="true"
      >
        <span
          className="font-display text-cream opacity-2.5"
          style={{
            fontSize: 'clamp(6rem, 20vw, 22rem)',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          CREATE
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans-body tracking-[0.28em] text-xs uppercase select-none text-gold"
        >
          Let's collaborate
        </motion.p>

        {/* Main CTA headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display leading-none select-none text-4xl md:text-7xl lg:9xl text-cream"
          style={{
            letterSpacing: '-0.025em',
          }}
        >
          LET'S CREATE
        </motion.h2>

        {/* Email button */}
        <a href="mailto:sachergerrit@gmail.com" className="flex items-center gap-4 ml-auto">
          <motion.button
            ref={ctaBtnRef}
            onMouseEnter={handleCtaMouseEnter}
            onMouseLeave={handleCtaMouseLeave}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-gold rounded-full text-xs shrink-0 whitespace-nowrap relative overflow-hidden group transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '1rem', paddingBottom: '1rem',
              background: 'transparent'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="relative z-10 transition-colors flex gap-2 duration-300 group-hover:text-bg">
              <Mail size={16} />
              sachergerrit@gmail.com
              <ArrowUpRight size={15} />
            </span>

            <motion.div
              className="absolute bg-gold rounded-full pointer-events-none"
              style={{
                width: '700px',
                height: '700px',
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
        </a>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center gap-6"
        >
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={'_blank'}
              aria-label={label}
              className="opacity-50 hover:opacity-100 transition-all duration-300"
            >
              <Icon style={{ width: '20px', height: '20px' }} />
            </a>
          ))}
        </motion.div>

        {/* Footer bar */}
        <div
          className="mt-24 h-10 w-full flex flex-row items-center justify-between gap-4 pt-3 border-t border-white/5"
        >
          <span
            className="font-display text-xs tracking-widest top-10"
          >
            <img src="/Logo.png" alt="Logo" className='h-3 w-auto' />
          </span>
          <span
            className="font-sans-body text-xs text-white/20"
          >
            © 2026 — All rights reserved
          </span>
          <span
            className="font-sans-body text-xs hidden md:block tracking-widest uppercase text-gold/30"
          >
            Crafted with intention
          </span>
        </div>
      </div>
    </section>
  );
}
