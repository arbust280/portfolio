import { useEffect, useRef } from 'react';
import { observeReveal } from '../lib/reveal';

/**
 * Scroll-triggered reveal. `as` lets it wrap li/article/etc, `i` staggers
 * siblings. The motion lives in CSS (`[data-reveal]` / `.is-revealed`);
 * this only decides *when* the class lands.
 */
export default function Reveal({ children, i = 0, as = 'div', className, style, ...rest }) {
  const ref = useRef(null);
  const Tag = as;

  useEffect(() => observeReveal(ref.current), []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{ '--i': i, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
