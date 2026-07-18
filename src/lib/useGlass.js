import { useCallback } from 'react';

/**
 * Tracks the cursor inside a glass panel so the specular highlight
 * (--mx / --my in index.css) follows the pointer. Attach the returned
 * handler to any element with the `.glass` class.
 */
export function useGlass() {
  return useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);
}
