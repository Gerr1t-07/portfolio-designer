import React from 'react';

export default function WaveSeparator({ flip = false, color = '#252618' }) {
  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ transform: flip ? 'scaleY(-1)' : 'none', lineHeight: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full"
        style={{ display: 'block', height: '80px' }}
      >
        <path
          d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
