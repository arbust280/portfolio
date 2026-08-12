/**
 * One IntersectionObserver for every reveal on the page.
 *
 * framer-motion span a separate observer per `whileInView` element and
 * re-rendered React on each intersection. Here the observer writes a
 * class and unobserves — the transition itself is CSS, so revealing a
 * section costs no JS beyond a single classList write.
 */

let observer = null;

function get() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // reveals are once-only
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0 },
  );
  return observer;
}

/** Observe `el`, or reveal it immediately when motion is unwelcome. */
export function observeReveal(el) {
  if (!el) return () => {};

  if (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    el.classList.add('is-revealed');
    return () => {};
  }

  const io = get();
  io.observe(el);
  return () => io.unobserve(el);
}
