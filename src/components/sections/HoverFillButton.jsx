import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function HoverFillButton({ children, onClick, style = {}, className, inverted = false }) {
  const btnRef = useRef(null);
  const [hoverData, setHoverData] = useState({ x: 0, y: 0, hover: false });

  const handleMouseEnter = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverData({ x, y, hover: true });
  };

  const handleMouseLeave = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverData({ x, y, hover: false });
  };

  const accentColor = style.color || '#A68F1F';
  const baseBg = inverted ? accentColor : (style.background || 'transparent');
  const baseText = inverted ? '#1a1e0e' : accentColor;
  const hoverCircleColor = inverted ? '#1a1e0e' : accentColor;
  const hoverText = inverted ? accentColor : '#1a1e0e';

  return (
    <motion.button
      ref={btnRef}
      className={`relative overflow-hidden group rounded-full font-sans-body tracking-wider cursor-pointer text-sm transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${className || ''}`}
      style={{
        ...style,
        background: baseBg,
        color: baseText,
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2 w-full h-full"
        initial={{ color: baseText }}
        animate={{ color: hoverData.hover ? hoverText : baseText }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>

      {/* Dynamic Fill Circle */}
      <motion.div
        className="absolute pointer-events-none rounded-full w-[600px] h-[600px] -translate-x-[50%] -translate-y-[50%]"
        style={{
          background: hoverCircleColor,
          left: hoverData.x,
          top: hoverData.y,
          zIndex: 0,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: hoverData.hover ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      />
    </motion.button>
  );
}

