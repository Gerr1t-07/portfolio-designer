import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import TikTok from '@/assets/icons/TikTok-Icon.svg?react';
import Instagram from '@/assets/icons/Instagram-Icon.svg?react';
import Dribbble from '@/assets/icons/Dribbble-Icon.svg?react';
import Fiverr from '@/assets/icons/Fiverr-Icons.svg?react';
import Twitter from '@/assets/icons/X-Icons.svg?react';
import LinkedIn from '@/assets/icons/LinkedIn-Icon.svg?react';
import ContactButton from '../ContactButton';


const SOCIALS = [
  { icon: TikTok, label: 'TikTok', href: 'https://www.tiktok.com/@gstudio026' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/gstudio026' },
  { icon: Dribbble, label: 'Dribbble', href: 'https://dribbble.com/sachergerrit' },
  { icon: Fiverr, label: 'Fiverr', href: 'https://de.fiverr.com/s/381GWRk' },
  { icon: Twitter, label: 'X', href: 'https://x.com/sacher_design' },
  { icon: LinkedIn, label: 'LinkedIn', href: 'www.linkedin.com/in/gerrit-sacher-29a4473b9' }
];

export default function ContactFooter() {
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
          Let's Collaborate and
        </motion.p>

        {/* Main CTA headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display leading-none select-none text-6xl md:text-8xl lg:text-[9rem] text-cream"
          style={{
            letterSpacing: '-0.025em',
          }}
        >
            CREATE
        </motion.h2>

        {/* Email button */}
          <ContactButton firstIcon={Mail} lastIcon={ArrowUpRight} text={`sachergerrit@gmail.com`} className="px-8 py-3 w-[300px] h-12" />

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
