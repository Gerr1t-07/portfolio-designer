import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Bleed text separator — large faded type bleeding off screen edges
export default function BleedText({ text, align = 'left' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    align === 'left' ? ['5%', '-5%'] : ['-5%', '5%']
  );

  return (
    <div ref={ref} className="overflow-visible w-fit pointer-events-none select-none">
      <motion.div
        style={{ x }}
        className="bleed-text"
        aria-hidden="true"
      >
        {text}
      </motion.div>
    </div>
  );
}
