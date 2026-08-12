import { useMemo, useRef } from 'react';

/**
 * Tracks the pointer inside a glass panel so the specular highlight
 * (--mx / --my in index.css) follows it.
 *
 * The previous version called getBoundingClientRect on every mousemove,
 * which forces a synchronous layout at pointer rate — with several
 * panels mounted that is the most expensive thing on the page. Here the
 * rect is read once on enter and reused, and the custom-property write
 * is throttled to a frame.
 *
 * Returns handlers to spread onto any element with the `.glass` class.
 */
export function useGlass() {
  const rect = useRef(null);
  const raf = useRef(0);
  const next = useRef({ el: null, x: 0, y: 0 });

  return useMemo(() => {
    const flush = () => {
      raf.current = 0;
      const { el, x, y } = next.current;
      if (!el) return;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };

    return {
      onPointerEnter: (e) => {
        rect.current = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--lit', '1');
      },
      onPointerMove: (e) => {
        const r = rect.current;
        if (!r) return;
        next.current = {
          el: e.currentTarget,
          x: e.clientX - r.left,
          y: e.clientY - r.top,
        };
        if (!raf.current) raf.current = requestAnimationFrame(flush);
      },
      onPointerLeave: (e) => {
        rect.current = null;
        e.currentTarget.style.setProperty('--lit', '0');
      },
    };
  }, []);
}
