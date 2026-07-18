import { useEffect, useRef } from 'react';

/**
 * The pointer is a light source: a soft radial glow follows the cursor
 * above the content, so glass panels sit in real moving light.
 * Skipped entirely on touch devices and under prefers-reduced-motion.
 */
export default function CursorLight() {
  const ref = useRef(null);

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches
    ) return;

    let raf = 0;
    const move = (e) => {
      const { clientX, clientY } = e;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const el = ref.current;
          if (!el) return;
          el.style.transform = `translate3d(${clientX - 300}px, ${clientY - 300}px, 0)`;
          el.style.opacity = '1';
        });
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-light" ref={ref} aria-hidden />;
}
