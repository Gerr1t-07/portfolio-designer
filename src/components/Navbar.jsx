import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import HoverFillButton from './HoverFillButton';

const links = [
  { label: 'Work', id: 'work', icon: '/WorkIcon.svg' },
  { label: 'Services', id: 'services', icon: '/ServicesIcon.svg' },
  { label: 'About', id: 'about', icon: '/AboutIcon.svg' },
];


export default function Navbar({ scrollTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
  const [visible, setVisible] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const navExpandedRef = useRef(false);
  const [modalOpen, setModalOpen] = useState(false)

  // NEW: Collapsible navbar states
  const [isExpanded, setIsExpanded] = useState(false);
  const expandTimer = useRef(null);
  const scrollTimer = useRef(null);
  const lastScrollY = useRef(0);

  const hideTimer = useRef(null);
  const iconRefs = useRef([]);
  const ulRef = useRef(null);

  // The spring-driven X position of the tooltip blob
  const targetX = useMotionValue(0);
  const springX = useSpring(targetX, {
    stiffness: 480,
    damping: 26,
    mass: 0.55,
  });

  // Stretch scale — blob squishes horizontally as it moves (liquid inertia)
  const scaleX = useSpring(1, { stiffness: 320, damping: 20, mass: 0.45 });
  const scaleY = useSpring(1, { stiffness: 320, damping: 20, mass: 0.45 });

  const prevX = useRef(0);
  const isVisible = useRef(false);

  const clearHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  // NEW: Expand/Collapse logic
  const handleNavMouseEnter = () => {
    if (expandTimer.current) clearTimeout(expandTimer.current);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    setIsExpanded(true);

    if (!navExpandedRef.current) {
      // First expand — wait for animation to settle
      setTimeout(() => {
        setNavReady(true);
        navExpandedRef.current = true;
      }, 650);
    } else {
      // Already expanded before — ready immediately
      setNavReady(true);
    }
  };

  const handleNavMouseLeave = () => {
    setNavReady(false);
    if (expandTimer.current) clearTimeout(expandTimer.current);
    expandTimer.current = setTimeout(() => {
      setIsExpanded(false);
      setVisible(false);
      isVisible.current = false;
      navExpandedRef.current = false; // reset so next expand waits again
    }, 3000);
  };

  useEffect(() => {
    const handler = (e) => setModalOpen(e.detail.open)
    window.addEventListener("contact-modal", handler)
    return () => window.removeEventListener("contact-modal", handler)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Expand on scroll up (if not at very top to avoid jitter)
      if (currentScrollY < lastScrollY.current && currentScrollY > 50) {
        setIsExpanded(true);
        if (expandTimer.current) clearTimeout(expandTimer.current);
        if (scrollTimer.current) clearTimeout(scrollTimer.current);

        // Auto-collapse after 5s of no scrolling
        scrollTimer.current = setTimeout(() => {
          setIsExpanded(false);
          setVisible(false);
          isVisible.current = false;
        }, 5000);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (expandTimer.current) clearTimeout(expandTimer.current);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  const getIconCenterX = (idx) => {
    const iconEl = iconRefs.current[idx];
    const ulEl = ulRef.current;
    if (!iconEl || !ulEl) return 0;
    const iconRect = iconEl.getBoundingClientRect();
    const ulRect = ulEl.getBoundingClientRect();
    return iconRect.left - ulRect.left + iconRect.width / 2;
  };

  const handleEnter = useCallback((idx) => {
    if (!navReady) return;
    clearHide();

    const centerX = getIconCenterX(idx);
    const dx = centerX - prevX.current;
    const dist = Math.abs(dx);

    if (!isVisible.current) {
      // Tooltip was hidden — snap instantly to the correct icon, no spring travel
      springX.jump(centerX);
      targetX.set(centerX);
      scaleX.jump(1);
      scaleY.jump(1);
    } else if (dist > 8) {
      // Already visible and moving between icons — apply liquid stretch
      const s = Math.min(1 + dist / 100, 1.5);
      scaleX.set(s);
      scaleY.set(Math.max(0.7, 1 / Math.sqrt(s)));
      targetX.set(centerX);
    } else {
      targetX.set(centerX);
    }

    prevX.current = centerX;
    setActiveIdx(idx);
    setVisible(true);
    isVisible.current = true;
  }, [navReady, springX, targetX, scaleX, scaleY]);

  const handleLeave = useCallback(() => {
    clearHide();
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      isVisible.current = false;
      prevX.current = 0;
      hideTimer.current = null;
    }, 400);
  }, []);

  // Restore scale to 1 as blob settles
  useEffect(() => {
    return springX.on('change', () => {
      scaleX.set(1);
      scaleY.set(1);
    });
  }, [springX, scaleX, scaleY]);

  useEffect(() => () => clearHide(), []);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={modalOpen
                ? { y: -120, opacity: 0 }        // shoots up and fades
                : { y: 0, opacity: 1 }
                }
        transition={modalOpen
                ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
        className="fixed top-4 z-50 flex justify-center w-[90vw] md:w-full pointer-events-none px-4 md:px-6"
      >
        <div style={{ width: '100%', maxWidth: '860px', display: 'flex', justifyContent: 'center' }}>
          <motion.nav
            onMouseEnter={handleNavMouseEnter}
            onMouseLeave={handleNavMouseLeave}
            className="glass-nav mt-5 flex items-center justify-between rounded-full pointer-events-auto overflow-visible"
            initial={false}
            animate={{
              width: isExpanded ? '100%' : '120px',
            }}
            transition={
              isExpanded
                ? { type: 'spring', bounce: 0.4, duration: 0.6 }
                : { type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.35 } // cubic-ease-in-out, no bounce
            }
            style={{
              height: '60px',
              border: '1px solid rgba(115,92,25,0.55)',
              position: 'relative',
              boxSizing: 'border-box',
              paddingLeft: isExpanded ? '2rem' : '0rem',   // instant swap is fine, hidden by the width animation
              paddingRight: isExpanded ? '2rem' : '0rem',
            }}
          >
            {/* Logo — Always visible */}
            <motion.button
              onClick={() => {
                              if (isDesktop) {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                setIsExpanded(true);
                              }
                            }}
              className="flex items-center justify-center p-1 shrink-0"
              animate={{
                width: isExpanded ? 'auto' : '100%',
              }}
              transition={
                isExpanded
                  ? { type: 'spring', bounce: 0.4, duration: 0.6 }
                  : { type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.35 }
              }
              style={{ height: '100%' }}
              aria-label="Home"
            >
              <img src="/Logo.png" alt="Logo" className="h-3.5 w-auto object-contain shrink-0" style={{ minWidth: '40px' }} />
            </motion.button>

            {/* Collapsible Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="flex items-center justify-end w-full shrink-0 h-full"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
                    // On exit, stagger in reverse so CTA fades first, then links, then gap closes
                  }}
                  style={{ minWidth: 'max-content', paddingRight: '5rem' }}
                >
                  {/* Nav links */}
                  <ul
                    ref={ulRef}
                    className="hidden md:flex items-center gap-10"
                    style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                  >
                    {links.map((l, idx) => (
                      <motion.li
                        key={l.id}
                        variants={{
                          hidden: { opacity: 0, y: -6 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
                        }}
                      >
                        <button
                          ref={(el) => (iconRefs.current[idx] = el)}
                          onClick={() => scrollTo(l.id)}
                          onMouseEnter={() => handleEnter(idx)}
                          onMouseLeave={handleLeave}
                          className="flex items-center justify-center opacity-50 hover:cursor-pointer hover:opacity-100 transition-opacity duration-300 shrink-0"
                          style={{ padding: '0.6rem 0.75rem' }}
                          aria-label={l.label}
                        >
                          <img
                            src={l.icon}
                            alt={l.label}
                            className="h-5 w-5 object-contain"
                            style={{ filter: 'brightness(0) invert(1)', pointerEvents: 'none' }}
                          />
                        </button>
                      </motion.li>
                    ))}

                    {/* ─── GOOEY BLOB LAYER ────────────────────────────────────────── */}
                    <AnimatePresence>
                      {visible && activeIdx !== null && (
                        <motion.div
                          key="goo-wrapper"
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            height: '30px',
                            pointerEvents: 'none',
                            zIndex: 100,
                            filter: 'url(#gooey-tooltip)',
                            overflow: 'visible',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <motion.div
                            style={{
                              x: springX,
                              translateX: '-50%',
                              scaleX,
                              scaleY,
                              position: 'absolute',
                              top: '50%',
                              translateY: '-50%',
                              height: '26px',
                              borderRadius: '999px',
                              background: 'transparent',
                              border: '1px solid rgb(166, 143, 31)',
                              paddingLeft: '12px',
                              paddingRight: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '58px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.6rem',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                lineHeight: 1,
                                visibility: 'hidden',
                                userSelect: 'none',
                              }}
                            >
                              {links[activeIdx].label}
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ─── CRISP LABEL OVERLAY ────────────────────────────────────── */}
                    <AnimatePresence>
                      {visible && activeIdx !== null && (
                        <motion.div
                          key="label-layer"
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            height: '30px',
                            pointerEvents: 'none',
                            zIndex: 102,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                        >
                          <motion.div
                            style={{
                              x: springX,
                              translateX: '-50%',
                              position: 'absolute',
                              top: '50%',
                              translateY: '-50%',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingLeft: '12px',
                              paddingRight: '12px',
                            }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={links[activeIdx].label}
                                initial={{ opacity: 0, y: 5, scale: 0.88 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.88 }}
                                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                                style={{
                                  fontSize: '0.6rem',
                                  letterSpacing: '0.16em',
                                  textTransform: 'uppercase',
                                  color: '#A68F1F',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                  lineHeight: 1,
                                  userSelect: 'none',
                                }}
                              >
                                {links[activeIdx].label}
                              </motion.span>
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ─── CARET ─────────────────── */}
                    <AnimatePresence>
                      {visible && (
                        <motion.div
                          key="caret"
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 1px)',
                            left: 0,
                            pointerEvents: 'none',
                            zIndex: 99,
                            x: springX,
                            translateX: '-50%',
                            originY: 'top',
                          }}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ type: 'spring', stiffness: 480, damping: 28 }}
                        >
                          <div
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '5px solid transparent',
                              borderRight: '5px solid transparent',
                              borderBottom: '5px solid rgb(166, 143, 31)',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </ul>

                  {/* CTA + hamburger wrapper */}
                  <motion.div
                    className="flex items-center gap-4 ml-auto"
                    variants={{
                      hidden: { opacity: 0, x: 10 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.25 } },
                    }}
                  >
                    <div className="hidden md:flex items-center">
                      <HoverFillButton
                        onClick={() => scrollTo('contact')}
                        className="px-8 py-3 w-[180px] h-10 uppercase border"
                      >
                        Get in Touch <ArrowUpRight size={12} className="inline ml-1" />
                      </HoverFillButton>
                    </div>

                    <button
                      className="md:hidden shrink-0 text-cream"
                      style={{ paddingRight: '1rem' }}
                      onClick={() => setMenuOpen((v) => !v)}
                      aria-label="Toggle menu"
                    >
                      {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="glass-nav fixed inset-x-4 top-20 z-40 rounded-2xl border border-gold/45"
            style={{ padding: '1.5rem' }}
          >
            <ul className="flex flex-col gap-4 w-[95%]">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => { scrollTo(l.id); setMenuOpen(false); }}
                    className="font-display w-full flex items-center justify-end gap-4 text-right text-base text-cream hover:text-gold tracking-[0.16em] uppercase transition-colors"
                  >
                    {l.label}
                    <img src={l.icon} alt={l.label} className="h-5 w-5 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => { scrollTo('contact'); setMenuOpen(false); }}
              className="flex items-center gap-2 h-10 border border-gold text-gold uppercase bg-transparent hover:bg-gold hover:text-bg active:scale-95 transition-all duration-300 ease-in-out select-none w-full justify-center rounded-full"
              style={{ marginTop: '1.5rem'}}
            > 
              Get in Touch <ArrowUpRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}