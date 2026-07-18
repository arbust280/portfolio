/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

/**
 * A literal RLC resonance curve — the subject of the Extended Essay.
 * The peak marks the resonant frequency; it draws itself on scroll.
 */
export default function ResonanceCurve({ className }) {
  // amplitude A(f) ∝ 1/√((f²-f0²)² + (γf)²), sampled to a smooth path
  const path =
    'M4,124 C60,122 96,118 128,108 C150,101 164,86 178,60 ' +
    'C186,44 192,26 200,26 C208,26 214,44 222,60 ' +
    'C236,86 250,101 272,108 C304,118 340,122 396,124';

  return (
    <svg
      className={className}
      viewBox="0 0 400 148"
      fill="none"
      role="img"
      aria-label="An RLC resonance curve peaking at the resonant frequency"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="resFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c8aff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#5c8aff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline + axis ticks */}
      <line x1="4" y1="124" x2="396" y2="124" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="200" y1="30" x2="200" y2="128" stroke="rgba(92,138,255,0.3)" strokeWidth="1" strokeDasharray="3 4" />

      {/* filled area under curve */}
      <motion.path
        d={`${path} L396,124 L4,124 Z`}
        fill="url(#resFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* the curve */}
      <motion.path
        d={path}
        stroke="#5c8aff"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />

      {/* resonance marker */}
      <motion.circle
        cx="200" cy="26" r="3.5" fill="#fff"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.3 }}
      />
      <text x="208" y="24" fill="rgba(210,210,232,0.5)" fontSize="9" fontFamily="'IBM Plex Mono', monospace" letterSpacing="1">
        f₀
      </text>
    </svg>
  );
}
