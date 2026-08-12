import { useState, useEffect, useRef } from 'react';

const SECTIONS = [
  { id: 'work', label: 'Work', band: 'var(--l700)' },
  { id: 'projects', label: 'Projects', band: 'var(--l590)' },
  { id: 'leadership', label: 'Leadership', band: 'var(--l530)' },
  { id: 'education', label: 'Education', band: 'var(--l470)' },
  { id: 'ethos', label: 'Ethos', band: 'var(--l410)' },
];

/* CSS scroll-timeline drives the progress bar for free where it exists;
   only older engines pay for a scroll listener. */
const NATIVE_TIMELINE =
  typeof CSS !== 'undefined' &&
  CSS.supports?.('animation-timeline', 'scroll()');

export default function Navbar() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const sheetRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const past = window.scrollY > 24;
        setScrolled(past);
        /* the hero's scroll cue reads through the translucent nav on its
           way out; this lets CSS retire it the moment you start scrolling */
        document.documentElement.classList.toggle('is-scrolled', past);
        if (!NATIVE_TIMELINE && progressRef.current) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* mobile sheet: lock the page, trap Escape, restore focus */
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return undefined;
    }
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector('a')?.focus();

    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <nav className={`site-nav${scrolled ? ' site-nav--scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
            aethrex
          </a>

          <ul className="nav-links">
            {SECTIONS.map(({ id, label, band }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link${active === id ? ' nav-link--active' : ''}`}
                  style={{ '--band': band }}
                  aria-current={active === id ? 'true' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={burgerRef}
            className={`nav-burger${open ? ' nav-burger--open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          ref={sheetRef}
        >
          <ul>
            {[...SECTIONS, { id: 'contact', label: 'Contact', band: '#ffffff' }].map(
              ({ id, label, band }) => (
                <li key={id}>
                  <a href={`#${id}`} style={{ '--band': band }} onClick={() => setOpen(false)}>
                    <span className="nav-sheet-dot" aria-hidden />
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      <div
        ref={progressRef}
        className={`scroll-progress${NATIVE_TIMELINE ? ' scroll-progress--native' : ''}`}
        aria-hidden
      />
    </>
  );
}
