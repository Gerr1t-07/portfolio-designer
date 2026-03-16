import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Layers, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import BleedText from '../BleedText';

const SERVICES = [
  {
    icon: Eye,
    number: '01',
    title: 'Art Direction',
    body: 'Visual strategy and creative vision for campaigns, brands, and digital products. From mood to masterpiece.',
    keywords: ['Brand Identity', 'Visual Systems', 'Campaign Direction'],
  },
  {
    icon: Layers,
    number: '02',
    title: '3D & Motion',
    body: 'Photorealistic renders, abstract motion sequences, and immersive 3D worlds built for screen and beyond.',
    keywords: ['Cinema4D', 'Blender', 'After Effects'],
  },
  {
    icon: Zap,
    number: '03',
    title: 'Digital Experiences',
    body: 'Interactive web experiences, WebGL environments, and high-fidelity UI that blur the line between design and art.',
    keywords: ['WebGL', 'React', 'Interaction Design'],
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    setTooltipVisible(true)
    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => { setTooltipVisible(false) }, 1000)

  }

  const moveToIndex = (index) => {
    // Handling looping
    const count = SERVICES.length;
    const newIndex = (index + count) % count;
    setActiveIndex(newIndex);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      moveToIndex(activeIndex + 1);
    } else if (info.offset.y > threshold) {
      moveToIndex(activeIndex - 1);
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      style={{ paddingBottom: '2rem', minHeight: '90vh' }}
    >
      {/* Bleed separator */}
      <BleedText text="SERVICES" align="left" />



      <div style={{ padding: '1rem clamp(0rem, 5vw, 0rem) 3rem', height: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-20"
          style={{ paddingBottom: "5rem" }}
        >
          <p
            className="font-sans-body text-sm tracking-widest uppercase opacity-40 mt-4 text-cream"
            style={{ paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', paddingTop: '1rem' }}
          >
            What I Do
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative w-full h-[600px] flex items-center justify-center select-none">

          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;

              // Calculate relative position in circle of size 3
              // 0: active, -1 (or 2): prev (above), 1: next (below)
              let relativeIndex = i - activeIndex;
              if (relativeIndex === 2) relativeIndex = -1;
              if (relativeIndex === -2) relativeIndex = 1;

              const isActive = relativeIndex === 0;
              const isPrev = relativeIndex === -1;
              const isNext = relativeIndex === 1;

              return (
                  <motion.div
                    key={s.number}
                    className="absolute w-full max-w-[800px] flex flex-col items-center text-center cursor-pointer z-50"
                    style={{ pointerEvents: isActive ? 'auto' : 'none', touchAction: isActive ? 'none' : 'auto' }}
                    initial={false}
                    animate={{
                      y: isActive ? 0 : isPrev ? -250 : 250,
                      scale: isActive ? 1 : 0.7,
                      opacity: isActive ? 1 : 0.3,
                      zIndex: isActive ? 10 : 5,
                      filter: isActive ? 'blur(0px)' : 'blur(2px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={handleDragEnd}
                    onClick={() => !isActive && moveToIndex(i)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-4 mb-8">
                        <span className="font-display text-sm text-gold opacity-60">{s.number}</span>
                        <Icon size={32} style={{ color: 'rgba(166,143,31,0.50)' }} />
                      </div>

                      <h3
                        className="font-display mb-6 text-2xl md:text-4xl lg:text-6xl text-cream"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {s.title}
                      </h3>

                      <p
                        className="font-sans-body text-lg leading-relaxed mb-8 max-w-[90vw]"
                        style={{ color: 'rgba(242,230,223,0.70)' }}
                      >
                        {s.body}
                      </p>

                      <div className="flex gap-4 flex-wrap justify-center">
                        {s.keywords.map((k) => (
                          <span
                            key={k}
                            className="font-sans-body text-xs tracking-wider px-3 py-1 border border-gold/20 rounded-full"
                            style={{ color: 'rgba(166,143,31,0.55)', backgroundColor: 'rgba(166,143,31,0.05)', padding: '0.25rem', marginTop: '0.5rem' }}
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
              );
            })}
          </div>

          {/* Controls Overlay */}
          <div className="absolute h-[50%] w-screen top-0" onClick={() => (moveToIndex(activeIndex - 1))}>
            <div className="flex w-full h-full items-start justify-center md:justify-end text-center text-gold md:text-gold/50" style={{ padding: "5rem", opacity: tooltipVisible ? 1 : 0, transition: "opacity 0.5s ease" }}>
              click for previous ↑
            </div>
          </div>
          <div className="absolute h-[50%] w-screen bottom-0" onClick={() => (moveToIndex(activeIndex + 1))}>
            <div className='flex w-full h-full items-end justify-center md:justify-end text-center text-gold md:text-gold/50' style={{ padding: "5rem", opacity: tooltipVisible ? 1 : 0, transition: "opacity 0.5s ease" }}>
              click for next ↓
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0">
        <div className="absolute inset-0 rounded-full bg-gold/5 blur-[120px]" />
      </div>
    </section>
  );
}

